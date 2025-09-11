// src/routes/RequireAuth.tsx
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useEffect } from "react";

export default function RequireAuth() {
  const token = useAppSelector((s: any) => s.auth.token);
  const user = useAppSelector((s: any) => s.auth.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isRegistered != 1) {
      navigate("/restaurantregister", { replace: true });
    } else if (user && (!user.expiresAt || user.expiresAt < Date.now())) {
      navigate("/subscription", { replace: true });
    }
  }, [user, navigate]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
