import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
export default function AdminRoute() {
  const {
    user,
    loading
  } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/user" replace />;
  return <Outlet />;
}
