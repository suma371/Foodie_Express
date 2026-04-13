const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createRestaurantReview,
  getRestaurantReviews,
} = require('../controllers/restaurantController');
const { protect, restaurantOwner } = require('../middleware/authMiddleware');

const { check } = require('express-validator');
const { validate } = require('../middleware/validatorMiddleware');

router.route('/')
  .get(getRestaurants)
  .post(
    protect, 
    restaurantOwner, 
    [
      check('name', 'Restaurant name is required').not().isEmpty(),
      check('address', 'Address is required').not().isEmpty(),
    ],
    validate,
    createRestaurant
  );

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, restaurantOwner, updateRestaurant)
  .delete(protect, restaurantOwner, deleteRestaurant);

router.route('/:id/reviews')
  .get(getRestaurantReviews)
  .post(protect, createRestaurantReview);

module.exports = router;
