import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) return null;

  return user && (user.role === 'admin' || user.role === 'restaurant_owner') ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
