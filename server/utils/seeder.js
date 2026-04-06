const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');
const FoodItem = require('../models/foodItemModel');
const connectDB = require('../config/db');

// Load env vars using node's native --env-file flag is handled by the caller
// but for manual runs we can use this fallback if needed, though we'll run it via npm script
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();

    console.log('Old Data Cleared...');

    // Load Data
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'));
    const restaurantsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/restaurants.json'), 'utf-8'));
    const foodItemsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/foodItems.json'), 'utf-8'));

    // Create Admin User
    const createdUsers = await User.insertMany(users);
    const adminId = createdUsers[0]._id;

    console.log('Admin User Created...');

    // Create Restaurants
    const restaurantsWithAdmin = restaurantsData.map((r) => ({
      ...r,
      ownerId: adminId,
    }));

    const createdRestaurants = await Restaurant.insertMany(restaurantsWithAdmin);
    console.log('10 Restaurants Created...');

    // Create Food Items
    const foodItemsWithIds = foodItemsData.map((f) => {
      const restaurant = createdRestaurants.find((r) => r.name === f.restaurantName);
      if (!restaurant) {
        console.error(`Restaurant NOT found for food item: ${f.name}`);
        return null;
      }
      return {
        ...f,
        restaurantId: restaurant._id,
      };
    }).filter(item => item !== null);

    await FoodItem.insertMany(foodItemsWithIds);
    console.log('20 Food Items Created...');

    console.log('Data Successfully Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Restaurant.deleteMany();
    await FoodItem.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
