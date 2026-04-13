# FoodieExpress 🍔

FoodieExpress is a premium, production-ready food delivery application built with a modern tech stack. Inspired by industry leaders like Swiggy and Zomato, it features a high-fidelity "2026 Aesthetic" UI, real-time order tracking, and a comprehensive administrative suite.

## ✨ Features

### 🛒 For Customers
- **High-Fidelity UI**: Premium, responsive interface with smooth Framer Motion animations.
- **Advanced Search & Discovery**: Filter by cuisine, rating, category, and more.
- **Express Checkout**: Streamlined checkout flow with Razorpay integration.
- **Real-Time Tracking**: SVG-animated order progression tracking.
- **Persistent Cart**: Localized cart management with real-time bill calculations.

### 🔐 Security & Core
- **JWT Authentication**: Secure, cookie-based authentication using `httpOnly` flags.
- **Production Validation**: Robust input sanitization and validation using `express-validator`.
- **Fault Tolerance**: Seamless fallback to high-quality mock data if the database is unreachable.

### 🏢 For Administrators / Owners
- **Business Dashboard**: Monitor revenue, orders, and active menu items.
- **Store Management**: Create, update, and manage restaurant profiles.
- **Digital Menu**: Full CRUD operations for food items with category management.
- **Order Control**: Real-time status updates (Preparing, Out for Delivery, Delivered).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/FoodieExpress.git
   cd FoodieExpress
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `server` directory (refer to `.env.example`):
   ```bash
   # d:/Projects/Foodie_Express/server/.env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. **Install Dependencies**
   ```bash
   # From the root directory
   npm install
   npm run install-all
   ```

4. **Seed Database (Optional)**
   ```bash
   cd server
   npm run data:import
   ```

5. **Run the Application**
   ```bash
   # From root
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.
- **Utilities**: Express-Validator, Morgan, BcryptJS.

## 📁 Project Structure

```
Foodie_Express/
├── client/           # React Frontend (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI atoms and modules
│   │   ├── context/    # Auth and Cart state
│   │   ├── pages/      # Route-level views
│   │   └── services/   # API communication (Axios)
├── server/           # Node/Express Backend
│   ├── models/       # Mongoose Schemas
│   ├── controllers/  # Business Logic
│   ├── routes/       # API endpoints
│   └── middleware/   # Auth and Error guards
└── README.md
```

## 📜 License
ISC License. Built with ❤️ by Antigravity.
