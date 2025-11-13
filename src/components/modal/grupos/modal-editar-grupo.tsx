import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, X, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import FormCrearGrupo from "@/components/form/formulario-crear-grupo";
import { useFormGrupos } from "@/hooks/formularios/grupos/useFormGrupos";
import { Aplicativo, UserInGroup } from "@/interfaces/grupos.interfaces";
import { SelectUsuariosGrupo } from "@/components/form/grupos/select-usuarios-grupo";
import { Result as ColaboradorResult, UserType } from "@/interfaces/colaboradores.interfaces";

export const ModalEditarGrupo = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { grupo, permisos } = useLoaderData() ?? { grupo: null, permisos: null };
  const [open, setOpen] = useState(isEdit);
  const [selectedUsers, setSelectedUsers] = useState<ColaboradorResult[]>([]);
  
  // Mapear usuarios del grupo a ColaboradorResult para mantener la estructura
  const initialUsers = useMemo(() => {
    if (!grupo?.users) return [];
    return grupo.users.map((user: UserInGroup): ColaboradorResult => ({
      id: user.id,
      name: user.name,
      picture: user.picture,
      agency: {
        id: user.agency.id,
        name: user.agency.name,
        code: "",
        state: true,
        chif: null,
        no_colaboradores: 0,
      },
      role: {
        id: user.role.id,
        role: user.role.role,
        state: true,
      },
      is_active: user.is_active,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
      // Campos requeridos pero no disponibles en UserInGroup - valores por defecto
      dpi: "",
      cif: "",
      username: "",
      user_type: UserType.Usuario,
      areas: [],
      email: "",
    }));
  }, [grupo?.users]);
  
  if (!id) {
    // Si no hay ID, no deberíamos estar en modo edición
    return null;
  }

  const dataGrupoEditar = {
    id,
    nombre: grupo?.nombre,
    permisos: permisos.map((permiso: Aplicativo) => permiso.id),
    usuarios: grupo?.users?.map((user) => user.id) || [],
    state: grupo?.state,
  };

  const { form, onSubmit, isLoading } = useFormGrupos(setOpen, dataGrupoEditar, selectedUsers, setSelectedUsers);
  
  /** ----- 4. cerrar con la X o backdrop ----- */
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && isEdit) {
      navigate("..", { replace: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Editar grupo</DialogTitle>
          <DialogDescription className="sr-only">Edita un grupo</DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
              navigate("..", { replace: true });
              form.reset();
            }}
          >
            <X />
            Cancelar
          </Button>
          <Button type="submit" variant="custom2" form="permisos-form" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
