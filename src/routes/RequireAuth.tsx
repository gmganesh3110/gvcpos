// src/routes/RequireAuth.tsx
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function RequireAuth() {
  const token = useAppSelector((s: any) => s.auth.token);
  const user = useAppSelector((s: any) => s.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  else if (user && user.isRegistered != 1) {
    navigate("/restaurantregister");
  } else if (user && (!user.expiresAt || user.expiresAt < Date.now())) {
    navigate("/subscription");
  }
  return <Outlet />;
}
