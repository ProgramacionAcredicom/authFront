import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/auth/auth.services";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, AtSign, Building2, Briefcase, MapPin } from "lucide-react";

/**
 * Componente para mostrar información básica del usuario (solo lectura)
 */
export const ProfileInfo = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-muted-foreground text-center">No se pudo cargar la información del usuario</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6">
      <CardHeader className="p-0 pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Información Personal</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Información básica - Grid responsivo: 1 col móvil, 2 tablet, 3 desktop */}
        <div className="grid gap-3 sm:gap-4 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Nombre completo - Ocupa toda la fila */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm font-medium">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Nombre completo
            </label>
            <p className="text-foreground rounded-md bg-muted/50 px-2 py-1.5 text-sm sm:text-base font-medium break-words">
              {user.name || "No especificado"}
            </p>
          </div>

          {/* Usuario y Correo */}
          <div className="space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm font-medium">
              <AtSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Usuario
            </label>
            <p className="text-foreground rounded-md bg-muted/50 px-2 py-1.5 text-sm sm:text-base font-medium break-words">
              {user.username || "No especificado"}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm font-medium">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Correo electrónico
            </label>
            <p className="text-foreground rounded-md bg-muted/50 px-2 py-1.5 text-sm sm:text-base font-medium break-all">
              {user.email || "No especificado"}
            </p>
          </div>

          {/* Información laboral */}
          {user.agency && (
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Agencia
              </label>
              <p className="text-foreground rounded-md bg-muted/50 px-2 py-1.5 text-sm sm:text-base font-medium break-words">
                {user.agency.name || "No especificado"}
              </p>
            </div>
          )}

          {user.area && (
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Área
              </label>
              <p className="text-foreground rounded-md bg-muted/50 px-2 py-1.5 text-sm sm:text-base font-medium break-words">
                {user.area.name || "No especificado"}
              </p>
            </div>
          )}

          {user.role && (
            <div className="space-y-1.5">
              <label className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Rol
              </label>
              <p className="text-foreground rounded-md bg-muted/50 px-2 py-1.5 text-sm sm:text-base font-medium break-words">
                {user.role.role || "No especificado"}
              </p>
            </div>
          )}

          {/* DPI y CIF */}
          {user.dpi && (
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs sm:text-sm font-medium">DPI</label>
              <p className="text-foreground rounded-md bg-muted/50 px-2 py-1.5 text-sm sm:text-base font-medium font-mono break-all">
                {user.dpi}
              </p>
            </div>
          )}

          {user.cif && (
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs sm:text-sm font-medium">CIF</label>
              <p className="text-foreground rounded-md bg-muted/50 px-2 py-1.5 text-sm sm:text-base font-medium font-mono break-all">
                {user.cif}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
