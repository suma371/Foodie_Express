const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant',
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FoodItem',
      },
    },
  ],
  address: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentStatus: {
    type: String,
    required: true,
    default: 'Pending',
    enum: ['Pending', 'Completed', 'Failed'],
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentDetails: {
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
    enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'],
  },
}, {
  timestamps: true,
});

// Optimization Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ restaurant: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
