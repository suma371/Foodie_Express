const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin, restaurantOwner } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, restaurantOwner, updateOrderStatus);

router.route('/:id/pay')
  .put(protect, admin, updateOrderPaymentStatus);

module.exports = router;
