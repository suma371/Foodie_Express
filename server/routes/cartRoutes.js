const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItemQty, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCart);

router.route('/add')
  .post(protect, addToCart);

router.route('/update')
  .put(protect, updateCartItemQty);

router.route('/remove/:foodItemId')
  .delete(protect, removeFromCart);

router.route('/clear')
  .delete(protect, clearCart);

module.exports = router;
