import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfilePicture } from "@/services/auth/auth.services";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, AtSign, Building2, Briefcase, MapPin, Upload, X, Loader2, IdCard, Shield, BadgeCheck, Key } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ReactNode, useRef } from "react";
import { toast } from "sonner";
import { splitName } from "@/lib/splitName";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

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
        <CardHeader className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
    <Card className="border-none">
      <CardHeader className="border-none pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-lg sm:text-xl">Información personal</CardTitle>
            <CardDescription className="mt-1">Datos de perfil y credenciales básicas de tu cuenta.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              size="sm"
              className="bg-blue-600 text-white shadow-sm hover:bg-blue-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              <Link to="/mi-acceso">
                <Key />
                Mi Acceso
              </Link>
            </Button>
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

      <CardContent className="border-none">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="flex flex-col items-center gap-5 p-6">
              <TooltipProvider>
                <Tooltip>
                  <div className="group relative">
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="focus-visible:ring-ring relative rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        onClick={openFileSelector}
                        disabled={updateMutation.isPending}
                        aria-label="Cambiar foto de perfil"
                      >
                        <Avatar
                          className={cn(
                            "group-hover:border-primary group-focus-visible:border-primary size-28 cursor-pointer border-2 border-transparent transition-all",
                            updateMutation.isPending && "opacity-50",
                          )}
                        >
                          <AvatarImage src={user?.picture} alt={user?.name || "Usuario"} />
                          <AvatarFallback className="bg-primary/10 text-2xl">{initials}</AvatarFallback>
                        </Avatar>

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/55 px-3 text-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          <Upload className="size-5 text-white" />
                          <span className="text-xs leading-tight font-medium text-white">Cambiar foto de perfil</span>
                        </div>

                        {updateMutation.isPending && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                            <Loader2 className="size-8 animate-spin text-white" />
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>

                    {user?.picture && (
                      <button
                        type="button"
                        className="absolute top-1 right-2 z-10 rounded-full bg-red-500 p-1.5 shadow-md transition-colors hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info("Para eliminar la foto, contacta al administrador");
                        }}
                        aria-label="Eliminar foto de perfil"
                      >
                        <X className="size-4 text-white" />
                      </button>
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
                  <TooltipContent>
                    <p>Haz clic para cambiar la foto de perfil</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex flex-col gap-1">
                  <p className="text-lg leading-tight font-bold text-balance">{user.name || "No especificado"}</p>
                  <p className="text-muted-foreground text-sm break-all">@{user.username || "No especificado"}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">{user.agency?.name || "Sin agencia"}</Badge>
                  <Badge variant="secondary">{user.role?.role || "Sin rol"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <InfoSection title="Información Personal">
              <div className="grid gap-x-6 gap-y-5 md:grid-cols-8 xl:grid-cols-12">
                <InfoField
                  icon={<User className="size-4" />}
                  label="Nombre completo"
                  value={user.name || "No especificado"}
                  className="md:col-span-4 xl:col-span-4"
                />
                <InfoField
                  icon={<AtSign className="size-4" />}
                  label="Usuario"
                  value={user.username || "No especificado"}
                  mono
                  className="md:col-span-2 xl:col-span-4"
                />
                <InfoField icon={<IdCard className="size-4" />} label="DPI" value={user.dpi || "No especificado"} mono className="md:col-span-2" />
                <InfoField
                  icon={<Mail className="size-4" />}
                  label="Correo electrónico"
                  value={user.email || "No especificado"}
                  wrap="break-all"
                  className="md:col-span-4 xl:col-span-4"
                />
                <InfoField
                  icon={<IdCard className="size-4" />}
                  label="ID"
                  value={user.cif || "No especificado"}
                  mono
                  className="md:col-span-2 xl:col-span-4"
                />
              </div>
            </InfoSection>

            <InfoSection title="Información Laboral">
              <div className="grid gap-4 md:grid-cols-3">
                <InfoField icon={<Building2 className="size-5" />} label="Agencia" value={user.agency?.name || "No especificado"} accent="blue" />
                <InfoField
                  icon={<MapPin className="size-5" />}
                  label="Área"
                  value={user.area?.name || "No especificado"}
                  accent="violet"
                  className="md:border-border/60 md:border-l md:pl-5"
                />
                <InfoField
                  icon={<Briefcase className="size-5" />}
                  label="Rol"
                  value={user.role?.role || "No especificado"}
                  accent="emerald"
                  className="md:border-border/60 md:border-l md:pl-5"
                />
              </div>
            </InfoSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-border/60 bg-background rounded-2xl border shadow-sm">
      <div className="px-5 py-4">
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <Separator />
      <div className="px-5 py-4">{children}</div>
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
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
  wrap?: "break-words" | "break-all";
  accent?: "blue" | "violet" | "emerald";
}) {
  const accentStyles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
  } as const;

  return (
    <div className={cn("min-w-0", className)}>
      <div className={cn("flex gap-3", accent ? "items-start" : "items-center")}>
        {accent ? (
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", accentStyles[accent])}>{icon}</div>
        ) : (
          <div className="text-muted-foreground shrink-0">{icon}</div>
        )}
        <div className="min-w-0">
          <div className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-[0.18em] uppercase">{label}</div>
          <p className={cn("text-sm leading-snug font-medium", wrap ?? "wrap-break-word", mono && "font-mono", accent && "text-sm")}>{value}</p>
        </div>
      </div>
    </div>
  );
}
