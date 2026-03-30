import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../store/authSlice';

export default function ProtectedRoute() {
  const isAuth   = useSelector(selectIsAuth);
  const location = useLocation();

  return isAuth
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
}