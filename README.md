# FoodieExpress 🍕

A production-grade, high-performance food delivery platform inspired by Swiggy, built with the MERN stack.

## 🚀 Key Features

- **Infinite Discovery**: Smooth, high-performance infinite scroll for restaurant discovery using `Intersection Observer`.
- **Premium UX**: Beautiful skeleton loading states (shimmer effect) and Framer Motion animations for that industry-standard feel.
- **Categorized Menu**: Intuitively grouped food items with sticky category navigation and smooth-scroll jumping.
- **Lazy Loading**: Entire app is optimized with route-based code splitting and a premium suspense fallback.
- **Secure Payments**: Integrated Razorpay (Test Mode) with signature verification and robust error handling.
- **Role-Based Access**: Specialized dashboards for `Admin` and `Restaurant Owners` with strict data isolation.
- **Optimized Performance**: Mongoose indexes on core fields (`email`, `city`, `restaurantId`, `userId`) for production-grade scalability.
- **Standardized REST API**: Strictly follows RESTful patterns with comprehensive data validation using `express-validator`.
- **Data Migration Ready**: Included a migration script to seamlessly transition existing database schemas to the new Swiggy-standard field names.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Authentication**: JWT with secure cookie storage.
- **Tools**: Razorpay SDK, Socket.io, React Hot Toast.

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Razorpay Test Keys

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/foodie-express.git

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

### 4. Running the App

```bash
# Start Backend (from server directory)
npm run dev

# Start Frontend (from client directory)
npm run dev
```

## 📐 Architecture

FoodieExpress follows a modular controller-service-route pattern ensuring scalability:
- `/client/src/pages`: Lazy-loaded high-fidelity views.
- `/client/src/components`: Reusable premium components (Skeletons, PageWrappers).
- `/server/controllers`: Secure logic for Orders, Payments, and RBAC.

## 📄 License
MIT
