import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfilePicture } from "@/services/auth/auth.services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Check, X, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { splitName } from "@/lib/splitName";

type ProfilePictureUploadError = {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
};

/**
 * Componente para actualizar la foto de perfil del usuario
 */
export const ProfilePictureUpload = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: user } = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60,
  });

  const updateMutation = useMutation({
    mutationFn: (file: File) => updateProfilePicture(file),
    onSuccess: () => {
      // Invalidar query para refrescar datos del usuario
      queryClient.invalidateQueries({ queryKey: ["info_user"] });
      toast.success("Foto de perfil actualizada correctamente");
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: unknown) => {
      const apiError = error as ProfilePictureUploadError;
      const errorMessage = apiError.response?.data?.error || apiError.message || "Error al actualizar la foto de perfil";
      toast.error(errorMessage);
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

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!selectedFile) return;
    updateMutation.mutate(selectedFile);
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { name, lastName } = splitName(user?.name || "");
  const initials = `${name?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <Card className="p-4 sm:p-6">
      <CardHeader className="p-0 pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Foto de Perfil</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Actualiza tu foto de perfil. Formatos permitidos: JPG, PNG, WEBP (máx. 5MB)</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-4 sm:space-y-6">
        {/* Layout principal: siempre vertical para mejor responsividad */}
        <div className="flex flex-col items-center gap-6">
          {/* Sección de avatares - Centrada siempre */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
            {/* Contenedor de avatares: vertical en móvil, horizontal en tablet/desktop */}
            <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:items-center">
              {/* Avatar actual */}
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-border shadow-md transition-all hover:shadow-lg">
                  <AvatarImage src={user?.picture} alt={user?.name || "Usuario"} />
                  <AvatarFallback className="text-xl sm:text-2xl bg-primary/10">{initials}</AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground text-xs font-medium">Foto actual</p>
              </div>

              {/* Flecha de transición (solo cuando hay preview) */}
              {preview && (
                <div className="flex items-center justify-center">
                  <div className="text-muted-foreground hidden rotate-90 md:block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                  <div className="text-muted-foreground block rotate-0 md:hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Preview de nueva foto si hay una seleccionada */}
              {preview && (
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-primary ring-2 ring-primary/20 shadow-lg transition-all">
                    <AvatarImage src={preview} alt="Nueva foto" />
                    <AvatarFallback className="text-xl sm:text-2xl bg-primary/10">
                      <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-primary text-xs font-medium">Nueva foto</p>
                </div>
              )}
            </div>
          </div>

          {/* Controles de acción - Centrados siempre, debajo de las fotos */}
          <div className="flex w-full flex-col gap-3 max-w-md mx-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="profile-picture-input"
              aria-label="Seleccionar foto de perfil"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full transition-all hover:bg-primary hover:text-primary-foreground"
              disabled={updateMutation.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {selectedFile ? "Cambiar imagen" : "Seleccionar imagen"}
            </Button>

            {selectedFile && (
              <>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex-1 transition-all"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Guardar
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                    className="flex-1 transition-all"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>

                {/* Información del archivo seleccionado */}
                <div className="rounded-md border bg-muted/30 p-2.5 sm:p-3">
                  <p className="text-muted-foreground text-xs break-words">
                    <span className="font-medium">Archivo:</span> {selectedFile.name}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    <span className="font-medium">Tamaño:</span>{" "}
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
