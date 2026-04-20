import { lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminRoute from './components/auth/AdminRoute';
import PrivateRoute from './components/auth/PrivateRoute';

// Professional Lazy Loading
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RestaurantList = lazy(() => import('./pages/RestaurantList'));
const RestaurantMenu = lazy(() => import('./pages/RestaurantMenu'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Search = lazy(() => import('./pages/Search'));

// Premium Suspense Fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
      </div>
    </div>
    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] animate-pulse">Initializing FoodieExpress</p>
  </div>
);

const Router = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/search" element={<Search />} />
        
        {/* Protected User Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-tracking/:id" element={<OrderTracking />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
        
        <Route path="*" element={
          <div className="not-found-page flex items-center justify-center min-h-[70vh]">
            <div className="text-center">
              <h1 className="text-8xl font-black text-primary/20">404</h1>
              <p className="text-xl font-bold text-secondary mt-[-2rem]">Page Not Found</p>
              <Link to="/" className="btn bg-primary text-white px-8 py-3 rounded-xl mt-8 inline-block font-bold shadow-lg">Back to Home</Link>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
};

export default Router;
