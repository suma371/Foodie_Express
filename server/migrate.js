const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const migrate = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const db = mongoose.connection.db;

    // 1. Rename Cart fields: user -> userId
    console.log('Migrating Carts...');
    await db.collection('carts').updateMany({}, { $rename: { "user": "userId" } });

    // 2. Rename Order fields: user -> userId, orderItems -> items, totalPrice -> totalAmount, shippingAddress -> address
    console.log('Migrating Orders...');
    await db.collection('orders').updateMany({}, {
      $rename: {
        "user": "userId",
        "orderItems": "items",
        "totalPrice": "totalAmount",
        "shippingAddress": "address"
      }
    });

    // 3. Add default deliveryTime to Restaurants if missing
    console.log('Updating Restaurants with deliveryTime...');
    await db.collection('restaurants').updateMany(
      { deliveryTime: { $exists: false } },
      { $set: { deliveryTime: "30-40 mins" } }
    );

    console.log('Migration completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
    process.exit(1);
  }
};

migrate();
