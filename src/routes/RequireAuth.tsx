// src/routes/RequireAuth.tsx
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export default function RequireAuth() {
  const token = useAppSelector((s:any) => s.auth.token);
  const user = useAppSelector((s:any) => s.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user is not registered, redirect to restaurant register page
  if (user && !user.isRegistered) {
      navigate("/restaurantregister");
  }

  return <Outlet />;
}
