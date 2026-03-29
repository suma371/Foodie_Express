const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [], totalPrice: 0 });
  }

  res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { foodItemId, name, quantity, price, image } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(item => item.foodItemId.toString() === foodItemId);

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ foodItemId, name, quantity, price, image });
  }

  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  await cart.save();
  res.json(cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItemQty = asyncHandler(async (req, res) => {
  const { foodItemId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });

  if (cart) {
    const itemIndex = cart.items.findIndex(item => item.foodItemId.toString() === foodItemId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Clear user cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id });

  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:foodItemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { foodItemId } = req.params;
  let cart = await Cart.findOne({ userId: req.user._id });

  if (cart) {
    cart.items = cart.items.filter(item => item.foodItemId.toString() !== foodItemId);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

module.exports = { getCart, addToCart, removeFromCart, updateCartItemQty, clearCart };
