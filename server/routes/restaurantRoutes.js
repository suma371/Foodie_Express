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
  globalSearch,
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

router.route('/search')
  .get(globalSearch);

router.route('/:id')
  .get(getRestaurantById)
  .put(
    protect, 
    restaurantOwner, 
    [
      check('name', 'Name cannot be empty').optional().not().isEmpty(),
      check('deliveryTime', 'Delivery time format is required').optional().not().isEmpty(),
    ],
    validate,
    updateRestaurant
  )
  .delete(protect, restaurantOwner, deleteRestaurant);

router.route('/:id/reviews')
  .get(getRestaurantReviews)
  .post(
    protect,
    [
      check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
      check('comment', 'Comment is required').not().isEmpty(),
    ],
    validate,
    createRestaurantReview
  );

module.exports = router;
