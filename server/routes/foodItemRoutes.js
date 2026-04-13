const express = require('express');
const router = express.Router();
const {
  getFoodItemsByRestaurant,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/foodItemController');
const { protect, restaurantOwner } = require('../middleware/authMiddleware');

const { check } = require('express-validator');
const { validate } = require('../middleware/validatorMiddleware');

router.route('/')
  .post(
    protect, 
    restaurantOwner, 
    [
      check('name', 'Item name is required').not().isEmpty(),
      check('price', 'Price must be a positive number').isFloat({ min: 0 }),
      check('category', 'Category is required').not().isEmpty(),
    ],
    validate,
    createFoodItem 
  );

router.route('/restaurant/:restaurantId')
  .get(getFoodItemsByRestaurant);

router.route('/:id')
  .put(protect, restaurantOwner, updateFoodItem)
  .delete(protect, restaurantOwner, deleteFoodItem);

module.exports = router;
