import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/auth/AdminRoute';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/restaurants" element={<RestaurantList />} />
      <Route path="/restaurant/:id" element={<RestaurantMenu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>
      
      <Route path="*" element={
        <div className="not-found-page flex-center">
          <div className="text-center">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-text">Page not found</p>
            <Link to="/" className="btn btn-primary mt-6">Back to Home</Link>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default Router;
