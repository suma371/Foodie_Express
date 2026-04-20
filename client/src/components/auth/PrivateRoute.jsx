import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
