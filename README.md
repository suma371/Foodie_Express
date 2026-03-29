# FoodieExpress

A full-stack food delivery application built with the MERN stack (MongoDB, Express, React, Node.js). 

## Features
- **Modern UI**: Built with React and Tailwind CSS for a fully responsive, premium user experience.
- **Authentication**: JWT-based login, registration, and protected routes using secure HTTP-only cookies.
- **Menu & Cart**: Dynamic food listing, real-time cart state management, and an interactive checkout flow.
- **Admin Dashboard**: Manage food items and view incoming orders with ease.

---

## Setup Instructions

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.
For this project, MongoDB should be running locally on `mongodb://127.0.0.1:27017`.

### 1. Environment Setup
The project relies on environment variables for the backend. A `.env` file is already created inside the `/server` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/foodieexpress
JWT_SECRET=supersecretkey123
JWT_EXPIRE=30d
```

### 2. Backend Installation
Navigate into the `server` directory and install dependencies:
```bash
cd server
npm install
```

### 3. Database Seeding
To populate the database with sample food items for the menu:
```bash
npm run data:import
```

---

### 4. Frontend Installation
Open a new terminal, navigate to the `client` directory, and install dependencies:
```bash
cd client
npm install
```

---

## Running the Application

You will need to run the server and client concurrently.

**Start the Backend Server (Terminal 1):**
```bash
cd server
npm run dev
```
*(The server will start on port 5000 and connect to MongoDB).*

**Start the Frontend Client (Terminal 2):**
```bash
cd client
npm run dev
```
*(The Vite client will start on port 5173).*

Navigate to `http://localhost:5173` in your browser to view the application!
