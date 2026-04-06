const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    restaurant,
    shippingAddress,
    paymentMethod,
    totalPrice,
    paymentStatus,
    paymentDetails,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      user: req.user._id,
      restaurant,
      orderItems: orderItems.map((x) => ({
        ...x,
        foodItem: x.foodItemId || x._id, // Support different object formats
        _id: undefined,
      })),
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('restaurant', 'name');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin or RestaurantOwner
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status || order.status;
    const updatedOrder = await order.save();

    // Broadcast the status update to the user's specific room
    const io = req.app.get('io');
    if (io) {
      io.to(updatedOrder.user.toString()).emit('orderStatusUpdated', {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
      });
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order payment status
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.paymentStatus = paymentStatus || order.paymentStatus;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('restaurant', 'name');
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .populate('restaurant', 'name');
  res.json(orders);
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  updateOrderPaymentStatus,
  getMyOrders,
  getOrders,
};
