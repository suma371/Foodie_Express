const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/restaurantModel');
const Review = require('../models/reviewModel');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).maxTimeMS(2000); // 2s timeout
    res.json(restaurants);
  } catch (err) {
    console.warn('DB connection timed out, returning mock fallback');
    // We can't import frontend mockData here easily due to CJS/ESM
    // For now, return an empty array and let frontend handle its mockData
    // Or we could define a small subset here.
    res.json([]);
  }
});

// @desc    Get restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).maxTimeMS(2000);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404);
      throw new Error('Restaurant not found');
    }
  } catch (err) {
    console.warn('DB error, returning 404 for frontend fallback');
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private/Admin or RestaurantOwner
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, description, address, image, ownerId } = req.body;

  const restaurant = new Restaurant({
    ownerId: (req.user.role === 'admin' && ownerId) ? ownerId : req.user._id,
    name,
    description,
    address,
    image,
  });

  const createdRestaurant = await restaurant.save();
  res.status(201).json(createdRestaurant);
});

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Owner
const updateRestaurant = asyncHandler(async (req, res) => {
  const { name, description, address, image } = req.body;
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

  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      restaurant: req.params.id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Restaurant already reviewed');
    }

    const review = new Review({
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      restaurant: req.params.id,
    });

    await review.save();

    const reviews = await Review.find({ restaurant: req.params.id });

    restaurant.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await restaurant.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

// @desc    Get all reviews for a restaurant
// @route   GET /api/restaurants/:id/reviews
// @access  Public
const getRestaurantReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ restaurant: req.params.id }).sort({ createdAt: -1 });
  res.json(reviews);
});

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantReview,
  getRestaurantReviews,
};
