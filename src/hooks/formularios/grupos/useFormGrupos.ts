import { useMutationEliminarGrupo, useMutationGrupos, useMutationUpdateGrupo } from "@/hooks/grupos/useMutationGrupos";
import { CrearGrupoSchema, crearGrupoSchema, eliminarGrupoSchema, EliminarGrupoSchema } from "@/schemas/grupos/grupos.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useFormGrupos = (
  setOpen: (open: boolean) => void,
  dataGrupoEditar?: {
    id: string;
    nombre: string;
    permisos: string[];
    state: boolean;
  },
) => {
  const isEdit = Boolean(dataGrupoEditar);
  const form = useForm<CrearGrupoSchema>({
    resolver: zodResolver(crearGrupoSchema),
    defaultValues: {
      nombre: isEdit ? dataGrupoEditar?.nombre : "",
      permisos: isEdit ? dataGrupoEditar?.permisos.map((permiso) => parseInt(permiso)) : [],
      state: isEdit ? dataGrupoEditar?.state : true,
    },
    mode: "onChange",
  });
  const { mutationGrupos, isLoading } = useMutationGrupos();
  const { mutationUpdateGrupo } = useMutationUpdateGrupo();
  const onSubmit = async (data: CrearGrupoSchema) => {
    if (isEdit) {
      await mutationUpdateGrupo.mutateAsync({ id: dataGrupoEditar!.id, data });
    } else {
      await mutationGrupos.mutateAsync(data);
    }
    setOpen(false);
    form.reset();
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
    await mutationEliminarGrupo.mutateAsync({ id: id! });
    form.reset();
    setOpen?.(false);
  };
  return {
    form,
    onSubmit,
    isLoading,
  };
};
