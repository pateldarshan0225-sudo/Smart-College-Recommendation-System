import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
export default function ProtectedRoute() {
  const {
    user,
    loading
  } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'user') return <Navigate to="/admin" replace />;
  return <Outlet />;
}
