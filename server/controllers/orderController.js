const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Restaurant = require('../models/restaurantModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    items,
    restaurant,
    address,
    paymentMethod,
    totalAmount,
    paymentStatus,
    paymentDetails,
  } = req.body;

  if (items && items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      userId: req.user._id,
      restaurant,
      items: items.map((x) => ({
        ...x,
        foodItem: x.foodItemId || x.foodItem || x._id,
        _id: undefined,
      })),
      address,
      paymentMethod,
      paymentStatus,
      paymentDetails,
      totalAmount,
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
    .populate('userId', 'name email text')
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
  const orders = await Order.find({ userId: req.user._id }).populate('restaurant', 'name');
  res.json(orders);
});

// @desc    Get all orders (with RBAC)
// @route   GET /api/orders
// @access  Private/Admin or RestaurantOwner
const getOrders = asyncHandler(async (req, res) => {
  let query = {};
  
  if (req.user.role === 'restaurant_owner') {
    const restaurants = await Restaurant.find({ ownerId: req.user._id });
    const restaurantIds = restaurants.map(r => r._id);
    query = { restaurant: { $in: restaurantIds } };
  } else if (req.user.role !== 'admin') {
    query = { userId: req.user._id };
  }

  const orders = await Order.find(query)
    .populate('userId', 'id name email')
    .populate('restaurant', 'name address image');
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
