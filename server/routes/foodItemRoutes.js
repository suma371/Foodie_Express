const express = require('express');
const router = express.Router();
const {
  getFoodItemsByRestaurant,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/foodItemController');
const { protect, restaurantOwner } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, restaurantOwner, createFoodItem);

router.route('/restaurant/:restaurantId')
  .get(getFoodItemsByRestaurant);

router.route('/:id')
  .put(protect, restaurantOwner, updateFoodItem)
  .delete(protect, restaurantOwner, deleteFoodItem);

module.exports = router;
