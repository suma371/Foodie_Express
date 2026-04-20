const mongoose = require('mongoose');

// Global flag for other components to check DB health
global.isOfflineMode = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isOfflineMode = false;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ SERVER STARTING IN "OFFLINE/MOCK" MODE. DATA WILL NOT BE PERSISTED.');
    global.isOfflineMode = true;
  }
};

module.exports = connectDB;
