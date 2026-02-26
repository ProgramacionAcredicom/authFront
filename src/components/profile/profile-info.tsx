import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfilePicture } from "@/services/auth/auth.services";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, AtSign, Building2, Briefcase, MapPin, Upload, X, Loader2, IdCard, Shield, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ReactNode, useRef } from "react";
import { toast } from "sonner";
import { splitName } from "@/lib/splitName";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ProfilePictureError = {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
};

export const ProfileInfo = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60,
  });

  const updateMutation = useMutation({
    mutationFn: (file: File) => updateProfilePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["info_user"] });
      toast.success("Foto de perfil actualizada correctamente");
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error: unknown) => {
      const apiError = error as ProfilePictureError;
      const errorMessage = apiError.response?.data?.error || apiError.message || "Error al actualizar la foto de perfil";
      toast.error(errorMessage);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecciona una imagen válida (JPG, PNG o WEBP)");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("La imagen es demasiado grande. El tamaño máximo es 5MB");
      return;
    }

    updateMutation.mutate(file);
  };

  const openFileSelector = () => fileInputRef.current?.click();

  const { name, lastName } = splitName(user?.name || "");
  const initials = `${name?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
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
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl">Información personal</CardTitle>
            <CardDescription className="mt-1">
              Datos de perfil y credenciales básicas de tu cuenta.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={user?.otp_enabled ? "default" : "secondary"} className={user?.otp_enabled ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
              <Shield className="mr-1 h-3 w-3" />
              {user?.otp_enabled ? "MFA activo" : "MFA inactivo"}
            </Badge>
            {user?.is_staff && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <BadgeCheck className="mr-1 h-3 w-3" />
                Staff
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-3.5 sm:p-4">
          <div className="grid min-w-0 gap-3.5 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
            <div className="rounded-xl border border-border/60 bg-background p-3.5 sm:p-4">
              <div className="flex flex-col items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group relative cursor-pointer" onClick={openFileSelector}>
                        <div className="relative">
                          <Avatar className={`h-24 w-24 sm:h-28 sm:w-28 cursor-pointer border-2 border-transparent transition-all group-hover:border-primary ${
                            updateMutation.isPending ? "opacity-50" : ""
                          }`}>
                            <AvatarImage src={user?.picture} alt={user?.name || "Usuario"} />
                            <AvatarFallback className="bg-primary/10 text-xl sm:text-2xl">{initials}</AvatarFallback>
                          </Avatar>
                          {updateMutation.isPending && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                              <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                        {user?.picture && (
                          <div
                            className="absolute right-2 top-2 z-10 cursor-pointer rounded-full bg-red-500 p-1.5 shadow-md transition-colors hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info("Para eliminar la foto, contacta al administrador");
                            }}
                          >
                            <X className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileSelect}
                          className="hidden"
                          disabled={updateMutation.isPending}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Haz clic para cambiar la foto de perfil</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button type="button" variant="outline" size="sm" className="mt-3 w-full" onClick={openFileSelector} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Cambiar foto
                    </>
                  )}
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">JPG, PNG o WEBP hasta 5MB</p>
              </div>
            </div>

            <div className="min-w-0 rounded-xl border border-border/60 bg-background p-3.5 sm:p-4">
              <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-lg font-semibold leading-tight sm:text-xl">{user.name || "No especificado"}</p>
                  <p className="mt-0.5 break-all text-sm text-muted-foreground">@{user.username || "No especificado"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{user.agency?.name || "Sin agencia"}</Badge>
                  <Badge variant="outline">{user.role?.role || "Sin rol"}</Badge>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="grid gap-2.5 sm:grid-cols-3">
                <InfoField icon={<Building2 className="h-4 w-4" />} label="Agencia" value={user.agency?.name || "No especificado"} compact />
                <InfoField icon={<MapPin className="h-4 w-4" />} label="Área" value={user.area?.name || "No especificado"} compact />
                <InfoField icon={<Briefcase className="h-4 w-4" />} label="Rol" value={user.role?.role || "No especificado"} compact />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <InfoSection title="Información personal" description="Datos de identidad y contacto" compact>
          <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <InfoField icon={<User className="h-4 w-4" />} label="Nombre completo" value={user.name || "No especificado"} className="xl:col-span-2" />
            <InfoField icon={<AtSign className="h-4 w-4" />} label="Usuario" value={user.username || "No especificado"} mono />
            <InfoField icon={<Mail className="h-4 w-4" />} label="Correo electrónico" value={user.email || "No especificado"} wrap="break-all" className="md:col-span-2 xl:col-span-3" />
            <InfoField icon={<IdCard className="h-4 w-4" />} label="DPI" value={user.dpi || "No especificado"} mono />
            <InfoField icon={<IdCard className="h-4 w-4" />} label="ID" value={user.cif || "No especificado"} mono />
          </div>
        </InfoSection>

        <InfoSection title="Información laboral" description="Ubicación y rol dentro del sistema" compact>
          <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-1">
            <InfoField icon={<Building2 className="h-4 w-4" />} label="Agencia" value={user.agency?.name || "No especificado"} />
            <InfoField icon={<MapPin className="h-4 w-4" />} label="Área" value={user.area?.name || "No especificado"} />
            <InfoField icon={<Briefcase className="h-4 w-4" />} label="Rol" value={user.role?.role || "No especificado"} />
          </div>
        </InfoSection>
        </div>
      </CardContent>
    </Card>
  );
};

function InfoSection({ title, description, children, compact = false }: { title: string; description?: string; children: ReactNode; compact?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-background", compact ? "p-3.5 sm:p-4" : "p-4 sm:p-5")}>
      <div className={cn("flex items-start justify-between gap-3", compact ? "mb-3" : "mb-4")}>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      <Separator className={cn(compact ? "mb-3" : "mb-4")} />
      {children}
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
  mono = false,
  className,
  wrap,
  compact = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
  wrap?: "break-words" | "break-all";
  compact?: boolean;
}) {
  return (
    <div className={cn("min-w-0 rounded-xl border border-border/60 bg-muted/10", compact ? "p-2.5" : "p-3.5", className)}>
      <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", compact ? "mb-0.5" : "mb-1")}>
        {icon}
        <span>{label}</span>
      </div>
      <p className={cn("text-sm font-medium", wrap ?? "break-words", mono && "font-mono")}>{value}</p>
    </div>
  );
}
