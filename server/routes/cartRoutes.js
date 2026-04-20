const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItemQty, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const { check } = require('express-validator');
const { validate } = require('../middleware/validatorMiddleware');

router.route('/')
  .get(protect, getCart);

router.route('/add')
  .post(
    protect,
    [
      check('foodItemId', 'Food Item ID is required').not().isEmpty(),
      check('quantity', 'Quantity must be at least 1').isInt({ min: 1 }),
      check('price', 'Price is required').isNumeric(),
    ],
    validate,
    addToCart
  );

router.route('/update')
  .put(
    protect,
    [
      check('foodItemId', 'Food Item ID is required').not().isEmpty(),
      check('quantity', 'Quantity must be a number').isInt({ min: 0 }),
    ],
    validate,
    updateCartItemQty
  );

router.route('/remove/:foodItemId')
  .delete(protect, removeFromCart);

router.route('/clear')
  .delete(protect, clearCart);

module.exports = router;
