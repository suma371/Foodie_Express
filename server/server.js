const app = require('./app');
const connectDB = require('./config/db');

// Environment variables are loaded via Node's native --env-file flag

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
