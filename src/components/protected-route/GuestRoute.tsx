import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuth.store";

export const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
