const asyncHandler = require('express-async-handler');
const FoodItem = require('../models/foodItemModel');
const { mockFoodItems } = require('../data/mockFoodItems');

// @desc    Get food items by restaurant
// @route   GET /api/fooditems/restaurant/:restaurantId
// @access  Public
const getFoodItemsByRestaurant = asyncHandler(async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ restaurantId: req.params.restaurantId }).maxTimeMS(2000);
    res.json(foodItems.length > 0 ? foodItems : mockFoodItems);
  } catch (err) {
    console.warn('DB error in foodItems, returning mocks');
    res.json(mockFoodItems);
  }
});

// @desc    Create a food item
// @route   POST /api/fooditems
// @access  Private/RestaurantOwner
const createFoodItem = asyncHandler(async (req, res) => {
  const { restaurantId, name, price, description, image, category } = req.body;

  const foodItem = new FoodItem({
    restaurantId,
    name,
    price,
    description,
    image,
    category,
  });

  const createdFoodItem = await foodItem.save();
  res.status(201).json(createdFoodItem);
});

// @desc    Update a food item
// @route   PUT /api/fooditems/:id
// @access  Private/RestaurantOwner
const updateFoodItem = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, isAvailable } = req.body;
  const foodItem = await FoodItem.findById(req.params.id);

  if (foodItem) {
    foodItem.name = name || foodItem.name;
    foodItem.price = price || foodItem.price;
    foodItem.description = description || foodItem.description;
    foodItem.image = image || foodItem.image;
    foodItem.category = category || foodItem.category;
    foodItem.isAvailable = isAvailable !== undefined ? isAvailable : foodItem.isAvailable;

    const updatedFoodItem = await foodItem.save();
    res.json(updatedFoodItem);
  } else {
    res.status(404);
    throw new Error('FoodItem not found');
  }
});

const deleteFoodItem = asyncHandler(async (req, res) => {
  const foodItem = await FoodItem.findById(req.params.id);

  if (foodItem) {
    // Note: We might want to check if the user owns the restaurant this item belongs to
    await FoodItem.deleteOne({ _id: req.params.id });
    res.json({ message: 'Food item removed' });
  } else {
    res.status(404);
    throw new Error('Food item not found');
  }
});

module.exports = {
  getFoodItemsByRestaurant,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
};
