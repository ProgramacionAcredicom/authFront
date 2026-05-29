import { useAuthStore } from "@/store/useAuth.store";
import { Navigate, Outlet } from "react-router-dom";
import { useInfoUserQuery } from "@/hooks/auth/usePermissionAccess";

/**
 * Componente de protección de rutas para usuarios staff.
 * 
 * Verifica que el usuario esté autenticado y tenga is_staff=true.
 * Si no es staff, redirige a /profile.
 * Si no está autenticado, redirige a /auth/login.
 */
export const StaffRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Obtener información del usuario para verificar is_staff
  const { data: user, isLoading } = useInfoUserQuery({ enabled: isAuthenticated });

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Mostrar loading mientras se obtiene la información
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

  // Si el usuario no es staff, redirigir a su perfil
  if (!user?.is_staff) {
    return <Navigate to="/profile" replace />;
  }

  // Usuario es staff, permitir acceso
  return <Outlet />;
};

interface StaffOnlyProps {
  children: React.ReactNode;
}

export const StaffOnly = ({ children }: StaffOnlyProps) => {
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

  if (!user?.is_staff) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
