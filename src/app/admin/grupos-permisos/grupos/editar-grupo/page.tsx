import { useLoaderData, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useMemo, useEffect } from "react";
import FormCrearGrupo from "@/components/form/formulario-crear-grupo";
import { useFormGrupos } from "@/hooks/formularios/grupos/useFormGrupos";
import { UserInGroup } from "@/interfaces/grupos.interfaces";
import { SelectUsuariosGrupo } from "@/components/form/grupos/select-usuarios-grupo";
import { Result as ColaboradorResult, UserType } from "@/interfaces/colaboradores.interfaces";
import { PermisosByIDType } from "@/interfaces/permisos.interfaces";
import { Loader2 } from "lucide-react";

export const EditarGrupoPage = () => {
  const { grupo, permisosResponse } = useLoaderData() as {
    grupo: any;
    permisosResponse: PermisosByIDType;
  };
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState<ColaboradorResult[]>([]);

  // Extraer IDs de los permisos del grupo
  const permisosIds = useMemo(() => {
    return permisosResponse?.permisos?.map((p) => p.id) || [];
  }, [permisosResponse]);

  // Mapear usuarios del grupo a ColaboradorResult para mantener la estructura
  const initialUsers = useMemo(() => {
    if (!grupo?.users) return [];
    return grupo.users.map((user: UserInGroup): ColaboradorResult => ({
      id: user.id,
      name: user.name,
      picture: user.picture,
      agency: user.agency
        ? {
            id: user.agency.id,
            name: user.agency.name,
            code: "",
            state: true,
            chif: null,
            no_colaboradores: 0,
          }
        : {
            id: 0,
            name: "",
            code: "",
            state: true,
            chif: null,
            no_colaboradores: 0,
          },
      role: user.role
        ? {
            id: user.role.id,
            role: user.role.role,
            state: true,
          }
        : {
            id: 0,
            role: "",
            state: true,
          },
      is_active: user.is_active ?? false,
      is_staff: user.is_staff ?? false,
      is_superuser: user.is_superuser ?? false,
      // Campos requeridos pero no disponibles en UserInGroup - valores por defecto
      dpi: "",
      cif: "",
      username: "",
      user_type: UserType.Usuario,
      areas: [],
      email: "",
    }));
  }, [grupo?.users]);

  const dataGrupoEditar = useMemo(() => {
    if (!grupo) return null;
    return {
      id: grupo.id?.toString() || "",
      nombre: grupo?.nombre || "",
      permisos: permisosIds.map((id) => id.toString()),
      usuarios: grupo?.users?.map((user: UserInGroup) => user.id) || [],
      state: grupo?.state ?? true,
    };
  }, [grupo, permisosIds]);

  const handleClose = () => {
    navigate(-1);
  };

  const { form, onSubmit, isLoading } = useFormGrupos(
    handleClose,
    dataGrupoEditar || undefined,
    selectedUsers,
    setSelectedUsers
  );

  // Actualizar el formulario cuando los datos se carguen
  useEffect(() => {
    if (dataGrupoEditar && permisosIds.length >= 0) {
      // Usar setTimeout para asegurar que el formulario se actualice después de que se renderice
      const timer = setTimeout(() => {
        form.reset({
          nombre: dataGrupoEditar.nombre,
          permisos: dataGrupoEditar.permisos.map((p) => parseInt(p)),
          state: dataGrupoEditar.state,
        });
        // Inicializar usuarios seleccionados
        if (initialUsers.length > 0) {
          setSelectedUsers(initialUsers);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [dataGrupoEditar, form, initialUsers, permisosIds]);

  if (!grupo) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header con navegación */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center gap-4 px-6 py-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">Editar grupo</h1>
            <p className="text-sm text-muted-foreground">
              Modifica la información, permisos y usuarios asignados al grupo
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto flex-1 px-6 py-2">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Card: Información básica del grupo */}
          <Card className="gap-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Información del grupo</CardTitle>
                  <CardDescription>
                    Configura el nombre y estado del grupo
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FormCrearGrupo form={form} onSubmit={onSubmit} />
            </CardContent>
          </Card>

          {/* Card: Usuarios asignados */}
          <Card className="gap-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Usuarios asignados</CardTitle>
                  <CardDescription>
                    {selectedUsers.length > 0
                      ? `${selectedUsers.length} usuario${selectedUsers.length !== 1 ? "s" : ""} asignado${selectedUsers.length !== 1 ? "s" : ""}`
                      : "Selecciona los usuarios que pertenecerán a este grupo"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SelectUsuariosGrupo
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                userIds={dataGrupoEditar?.usuarios}
                initialUsers={initialUsers}
                hideFilters={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer sticky con acciones */}
      <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                navigate(-1);
                form.reset();
              }}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="custom2" 
              form="permisos-form" 
              disabled={isLoading}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

