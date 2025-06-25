import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatorProtectedRoute = () => {
  const { isAuthenticated, isCreator, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated && isCreator ? <Outlet /> : <Navigate to="/login" />;
};

export default CreatorProtectedRoute;
