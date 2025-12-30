import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, X, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import FormCrearGrupo from "@/components/form/formulario-crear-grupo";
import { useFormGrupos } from "@/hooks/formularios/grupos/useFormGrupos";
import { UserInGroup } from "@/interfaces/grupos.interfaces";
import { SelectUsuariosGrupo } from "@/components/form/grupos/select-usuarios-grupo";
import { Result as ColaboradorResult, UserType } from "@/interfaces/colaboradores.interfaces";
import { getGrupoById } from "@/services/grupos/grupos.services";
import apiServices from "@/services/configAxios";
import { PermisosByIDType } from "@/interfaces/permisos.interfaces";
import { logger } from "@/lib/logger";

interface ModalEditarGrupoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grupoId: number | null;
}

export const ModalEditarGrupo = ({ open, onOpenChange, grupoId }: ModalEditarGrupoProps) => {
  const [grupo, setGrupo] = useState<any>(null);
  const [permisosIds, setPermisosIds] = useState<number[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<ColaboradorResult[]>([]);
  
  // Cargar datos cuando se abre el modal y hay un grupoId
  useEffect(() => {
    if (open && grupoId) {
      setIsLoadingData(true);
      // Obtener datos del grupo y permisos del grupo
      Promise.all([
        getGrupoById(grupoId.toString()),
        apiServices.get<PermisosByIDType>(`/grupo/permisos/${grupoId}`)
      ])
        .then(([grupoData, permisosResponse]) => {
          setGrupo(grupoData);
          const permisosGrupo = permisosResponse.data;
          
          // Extraer IDs de los permisos del grupo directamente
          const ids = permisosGrupo.permisos?.map((p) => p.id) || [];
          setPermisosIds(ids);
        })
        .catch((error) => {
          logger.errorWithContext("Error al cargar datos del grupo", error, {
            grupoId,
          });
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    } else if (!open) {
      // Limpiar datos cuando se cierra el modal
      setGrupo(null);
      setPermisosIds([]);
      setSelectedUsers([]);
    }
  }, [open, grupoId]);

  // Mapear usuarios del grupo a ColaboradorResult para mantener la estructura
  const initialUsers = useMemo(() => {
    if (!grupo?.users) return [];
    return grupo.users.map((user: UserInGroup): ColaboradorResult => ({
      id: user.id,
      name: user.name,
      picture: user.picture,
      agency: user.agency ? {
        id: user.agency.id,
        name: user.agency.name,
        code: "",
        state: true,
        chif: null,
        no_colaboradores: 0,
      } : {
        id: 0,
        name: "",
        code: "",
        state: true,
        chif: null,
        no_colaboradores: 0,
      },
      role: user.role ? {
        id: user.role.id,
        role: user.role.role,
        state: true,
      } : {
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
    if (!grupoId || !grupo) return null;
    return {
      id: grupoId.toString(),
      nombre: grupo?.nombre || "",
      permisos: permisosIds.map((id) => id.toString()),
      usuarios: grupo?.users?.map((user: UserInGroup) => user.id) || [],
      state: grupo?.state ?? true,
    };
  }, [grupoId, grupo, permisosIds]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const { form, onSubmit, isLoading } = useFormGrupos(handleClose, dataGrupoEditar || undefined, selectedUsers, setSelectedUsers);

  // Actualizar el formulario cuando los datos se carguen
  useEffect(() => {
    if (dataGrupoEditar && !isLoadingData && permisosIds.length >= 0) {
      // Usar setTimeout para asegurar que el formulario se actualice después de que se renderice
      // Aumentar el delay para dar tiempo a que el formulario cargue los permisos disponibles
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
  }, [dataGrupoEditar, isLoadingData, form, initialUsers, permisosIds]);

  if (!grupoId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Editar grupo</DialogTitle>
          <DialogDescription className="sr-only">Edita un grupo</DialogDescription>
        </DialogHeader>
        {isLoadingData ? (
          <div className="flex items-center justify-center py-12" role="status" aria-label="Cargando datos del grupo">
            <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
          </div>
        ) : dataGrupoEditar ? (
          <div className="flex flex-col gap-6">
            <FormCrearGrupo form={form} onSubmit={onSubmit} />
            <SelectUsuariosGrupo
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              userIds={dataGrupoEditar.usuarios}
              initialUsers={initialUsers}
              hideFilters={true}
            />
          </div>
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              form.reset();
            }}
          >
            <X />
            Cancelar
          </Button>
          <Button type="submit" variant="custom2" form="permisos-form" disabled={isLoading || isLoadingData}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
