import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/useAuth.store";
import type { OAuthPermission } from "@/lib/permissions";
import { hasAccess } from "@/lib/permissions";
import { useInfoUserQuery } from "@/hooks/auth/usePermissionAccess";

interface PermissionRouteProps {
  requiredPermission: OAuthPermission;
  children?: React.ReactNode;
}

export const PermissionRoute = ({ requiredPermission, children }: PermissionRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: user, isLoading } = useInfoUserQuery({ enabled: isAuthenticated });

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess(user, requiredPermission)) {
    return <Navigate to="/profile" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
