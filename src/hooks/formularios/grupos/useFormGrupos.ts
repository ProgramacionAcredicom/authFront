import { useMutationEliminarGrupo, useMutationGrupos, useMutationUpdateGrupo } from "@/hooks/grupos/useMutationGrupos";
import { CrearGrupoSchema, crearGrupoSchema, eliminarGrupoSchema, EliminarGrupoSchema } from "@/schemas/grupos/grupos.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";

export const useFormGrupos = (
  setOpen: (open: boolean) => void,
  dataGrupoEditar?: {
    id: string;
    nombre: string;
    permisos: string[];
    usuarios?: number[];
    state: boolean;
  },
  selectedUsers?: ColaboradorResult[],
  setSelectedUsers?: (users: ColaboradorResult[]) => void,
) => {
  const isEdit = Boolean(dataGrupoEditar);
  const form = useForm<CrearGrupoSchema>({
    resolver: zodResolver(crearGrupoSchema),
    defaultValues: {
      nombre: isEdit ? dataGrupoEditar?.nombre : "",
      permisos: isEdit ? dataGrupoEditar?.permisos.map((permiso) => parseInt(permiso)) : [],
      usuarios: isEdit ? dataGrupoEditar?.usuarios : [],
      state: isEdit ? dataGrupoEditar?.state : true,
    },
    mode: "onChange",
  });
  const { mutationGrupos, isLoading: isLoadingCreate } = useMutationGrupos();
  const { mutationUpdateGrupo, isLoading: isLoadingUpdate } = useMutationUpdateGrupo();
  const isLoading = isEdit ? isLoadingUpdate : isLoadingCreate;
  
  const onSubmit = async (data: CrearGrupoSchema) => {
    const usersIds = selectedUsers?.map((u) => u.id) || dataGrupoEditar?.usuarios || [];
    const submitData = {
      nombre: data.nombre,
      permisos: data.permisos,
      state: data.state,
      users_ids: usersIds,
    };
    if (isEdit) {
      if (!dataGrupoEditar?.id) {
        toast.error("ID del grupo no válido");
        return;
      }
      await mutationUpdateGrupo.mutateAsync({ id: dataGrupoEditar.id, data: submitData });
    } else {
      await mutationGrupos.mutateAsync(submitData);
    }
    setOpen(false);
    form.reset();
    setSelectedUsers?.([]);
  };
  return { form, onSubmit, isLoading };
};

export const useFormGruposEliminar = (
  data?: { aplicativos: { nombre: string }[]; nombre: string },
  setOpen?: (open: boolean) => void,
  id?: string,
) => {
  const form = useForm<EliminarGrupoSchema>({
    resolver: zodResolver(eliminarGrupoSchema),
    defaultValues: {
      aplicativo: data?.aplicativos?.length && data?.aplicativos.length > 0 ? data?.aplicativos[0]?.nombre : "SIN APLICATICO N/A",
      nombre: data?.nombre ?? "",
    },
    mode: "onChange",
  });
  const { mutationEliminarGrupo, isLoading } = useMutationEliminarGrupo();
  const onSubmit = async () => {
    if (!id) {
      toast.error("ID no válido");
      return;
    }
    await mutationEliminarGrupo.mutateAsync({ id });
    form.reset();
    setOpen?.(false);
  };
  return {
    form,
    onSubmit,
    isLoading,
  };
};
