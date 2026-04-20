const mongoose = require('mongoose');

const foodItemSchema = mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant',
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
});

// Optimization Indexes
foodItemSchema.index({ restaurantId: 1 });
foodItemSchema.index({ category: 1 });
foodItemSchema.index({ name: 'text' });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
