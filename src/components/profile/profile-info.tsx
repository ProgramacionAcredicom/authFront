import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfilePicture } from "@/services/auth/auth.services";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, AtSign, Building2, Briefcase, MapPin, Upload, X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";
import { toast } from "sonner";
import { splitName } from "@/lib/splitName";
import { Table, TableCell, TableRow } from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Componente para mostrar información básica del usuario (solo lectura)
 */
export const ProfileInfo = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  const updateMutation = useMutation({
    mutationFn: (file: File) => updateProfilePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["info_user"] });
      toast.success("Foto de perfil actualizada correctamente");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Error al actualizar la foto de perfil";
      toast.error(errorMessage);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Por favor, selecciona una imagen válida (JPG, PNG o WEBP)");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("La imagen es demasiado grande. El tamaño máximo es 5MB");
      return;
    }

    // Enviar automáticamente al servidor
    updateMutation.mutate(file);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const { name, lastName } = splitName(user?.name || "");
  const initials = `${name?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

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
      <CardHeader className="p-0">
        <CardTitle className="text-lg sm:text-xl">Información Personal</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Layout horizontal: Foto a la izquierda, campos a la derecha */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Foto de perfil - Estilo similar a formulario de colaboradores */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group relative" onClick={openFileSelector}>
                    <div className="relative">
                      <Avatar className={`h-32 w-32 sm:h-36 sm:w-36 cursor-pointer border-2 border-transparent transition-all group-hover:border-primary ${
                        updateMutation.isPending ? 'opacity-50' : ''
                      }`}>
                        <AvatarImage src={user?.picture} alt={user?.name || "Usuario"} />
                        <AvatarFallback className="text-2xl sm:text-3xl bg-primary/10">{initials}</AvatarFallback>
                      </Avatar>
                      {updateMutation.isPending && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                          <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    {/* Overlay con icono de upload al hover */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    {/* Botón para eliminar foto si existe */}
                    {user?.picture && (
                      <div
                        className="absolute top-2 right-2 cursor-pointer rounded-full bg-red-500 p-1.5 transition-colors hover:bg-red-600 z-10 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Eliminar foto (enviar null al servidor)
                          const formData = new FormData();
                          formData.append("picture", "null");
                          // Nota: Necesitaríamos un método específico para eliminar, por ahora solo prevenimos el click
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
          </div>

          <Table>
              <TableRow>
                <TableCell><User className="size-3 sm:size-4 inline-block" /> Nombre completo:</TableCell>
                <TableCell>{user.name || "No especificado"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><AtSign className="size-3 sm:size-4 inline-block" /> Usuario:</TableCell>
                <TableCell>{user.username || "No especificado"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Mail className="size-3 sm:size-4 inline-block" /> Correo electrónico:</TableCell>
                <TableCell>{user.email || "No especificado"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Building2 className="size-3 sm:size-4 inline-block" /> Agencia:</TableCell>
                <TableCell>{user.agency?.name || "No especificado"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><MapPin className="size-3 sm:size-4 inline-block" /> Área:</TableCell>
                <TableCell>{user.area?.name || "No especificado"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Briefcase className="size-3 sm:size-4 inline-block" /> Rol:</TableCell>
                <TableCell>{user.role?.role || "No especificado"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>DPI:</TableCell>
                <TableCell>{user.dpi}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ID:</TableCell>
                <TableCell>{user.cif}</TableCell>
              </TableRow>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
