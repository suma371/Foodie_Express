const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  cuisine: {
    type: [String],
    default: ['Multicuisine'],
  },
  location: {
    city: String,
    area: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  deliveryTime: {
    type: String,
    default: '30-40 mins',
  },
}, {
  timestamps: true,
});

// Optimization Indexes
restaurantSchema.index({ "location.city": 1 });
restaurantSchema.index({ name: 1 });
restaurantSchema.index({ ownerId: 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
