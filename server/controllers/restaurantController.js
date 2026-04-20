const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/restaurantModel');
const FoodItem = require('../models/foodItemModel');
const Review = require('../models/reviewModel');
const { mockRestaurants } = require('../data/mockRestaurants');

// @desc    Get all restaurants with search, filter, and pagination
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  // Search Logic
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  // Location/City Filter (Optimized with Index)
  const city = req.query.city
    ? { "location.city": { $regex: req.query.city, $options: 'i' } }
    : {};

  // Cuisine Filter
  const cuisine = req.query.cuisine
    ? { cuisine: { $in: [req.query.cuisine] } }
    : {};

  // Rating Filter
  const minRating = req.query.minRating
    ? { rating: { $gte: Number(req.query.minRating) } }
    : {};

  // Combine Queries
  const query = { ...keyword, ...city, ...cuisine, ...minRating };
  
  if (req.query.ownerId) query.ownerId = req.query.ownerId;

  try {
    const count = await Restaurant.countDocuments(query).maxTimeMS(2000);
    const restaurants = await Restaurant.find(query)
      .sort({ rating: -1, createdAt: -1 }) // Sort by rating for premium feel
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .maxTimeMS(2000);

    // Fallback to Mock Data if no results found or forced offline
    if (global.isOfflineMode || restaurants.length === 0) {
      let filteredMocks = [...mockRestaurants];
      if (req.query.keyword) {
        filteredMocks = filteredMocks.filter(r => r.name.toLowerCase().includes(req.query.keyword.toLowerCase()));
      }
      if (req.query.city) {
        filteredMocks = filteredMocks.filter(r => r.location?.city?.toLowerCase().includes(req.query.city.toLowerCase()));
      }
      return res.json({ 
        restaurants: filteredMocks, 
        page, 
        pages: Math.ceil(filteredMocks.length / pageSize),
        count: filteredMocks.length 
      });
    }

    res.json({ restaurants, page, pages: Math.ceil(count / pageSize), count });
  } catch (err) {
    res.json({ 
      restaurants: mockRestaurants, 
      page: 1, 
      pages: 1, 
      count: mockRestaurants.length 
    });
  }
});

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).maxTimeMS(2000);
    if (!restaurant) {
      const mock = mockRestaurants.find(r => r._id === req.params.id) || mockRestaurants[0];
      return res.json(mock);
    }
    res.json(restaurant);
  } catch (err) {
    const mock = mockRestaurants.find(r => r._id === req.params.id) || mockRestaurants[0];
    res.json(mock);
  }
});

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private/Admin or RestaurantOwner
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, description, address, image, ownerId, location, cuisine, deliveryTime } = req.body;

  const restaurant = new Restaurant({
    ownerId: (req.user.role === 'admin' && ownerId) ? ownerId : req.user._id,
    name,
    description,
    address,
    image,
    location,
    cuisine,
    deliveryTime: deliveryTime || '30-40 mins'
  });

  const createdRestaurant = await restaurant.save();
  res.status(201).json(createdRestaurant);
});

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Owner
const updateRestaurant = asyncHandler(async (req, res) => {
  const { name, description, address, image, location, cuisine, deliveryTime } = req.body;
  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this restaurant');
    }

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.address = address || restaurant.address;
    restaurant.image = image || restaurant.image;
    restaurant.location = location || restaurant.location;
    restaurant.cuisine = cuisine || restaurant.cuisine;
    restaurant.deliveryTime = deliveryTime || restaurant.deliveryTime;

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin or Owner
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this restaurant');
    }

    await Restaurant.deleteOne({ _id: req.params.id });
    res.json({ message: 'Restaurant removed' });
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

// @desc    Create new review
// @route   POST /api/restaurants/:id/reviews
// @access  Private
const createRestaurantReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    restaurant: req.params.id,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this restaurant');
  }

  const review = new Review({
    name: req.user.name || 'Anonymous',
    rating: Number(rating),
    comment,
    user: req.user._id,
    restaurant: req.params.id,
  });

  await review.save();

  const allReviews = await Review.find({ restaurant: req.params.id });
  restaurant.numReviews = allReviews.length;
  restaurant.rating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

  await restaurant.save();
  res.status(201).json({ message: 'Review added successfully', review });
});

// @desc    Get all reviews for a restaurant
// @route   GET /api/restaurants/:id/reviews
// @access  Public
const getRestaurantReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ restaurant: req.params.id }).sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Global Search (Unified Restaurants and Dishes)
// @route   GET /api/restaurants/search
// @access  Public
const globalSearch = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 2) {
    return res.json({ restaurants: [], dishes: [] });
  }

  // Define regex for fuzzy matching
  const regex = { $regex: query, $options: 'i' };

  // Parallel searching for better performance
  const [restaurants, dishes] = await Promise.all([
    Restaurant.find({
      $or: [
        { name: regex },
        { cuisine: { $in: [new RegExp(query, 'i')] } },
        { "location.area": regex },
      ]
    }).limit(10).maxTimeMS(1000),

    FoodItem.find({
      $or: [
        { name: regex },
        { category: regex },
      ]
    })
    .populate('restaurantId', 'name image rating deliveryTime')
    .limit(20)
    .maxTimeMS(1000)
  ]);

  // If DB results are thin, we can inject logic here or return mocks for development
  res.json({
    restaurants,
    dishes: dishes.map(d => ({
      ...d._doc,
      restaurant: d.restaurantId // Map for frontend convenience
    }))
  });
});

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantReview,
  getRestaurantReviews,
  globalSearch,
};
