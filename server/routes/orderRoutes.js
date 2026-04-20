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

const { check } = require('express-validator');
const { validate } = require('../middleware/validatorMiddleware');

router.route('/')
  .post(
    protect,
    [
      check('items', 'Order items are required').isArray({ min: 1 }),
      check('totalAmount', 'Total amount is required').isNumeric(),
      check('address', 'Delivery address is required').not().isEmpty(),
    ],
    validate,
    addOrderItems
  )
  .get(protect, admin, getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(
    protect, 
    restaurantOwner, 
    [
      check('status', 'Status is required').not().isEmpty(),
    ],
    validate,
    updateOrderStatus
  );

router.route('/:id/pay')
  .put(protect, admin, updateOrderPaymentStatus);

module.exports = router;
