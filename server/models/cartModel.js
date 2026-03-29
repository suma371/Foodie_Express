const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [
    {
      foodItemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FoodItem',
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: Number,
      image: String,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
}, {
  timestamps: true,
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
