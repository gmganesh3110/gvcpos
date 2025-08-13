// src/routes/PublicOnly.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

export default function PublicOnly() {
  const token = useAppSelector((s:any) => s.auth.token);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
