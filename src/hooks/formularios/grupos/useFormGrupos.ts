import { useMutationGrupos, useMutationUpdateGrupo } from "@/hooks/grupos/useMutationGrupos";
import { CrearGrupoSchema, crearGrupoSchema } from "@/schemas/grupos/grupos.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useFormGrupos = (
  setOpen: (open: boolean) => void,
  dataGrupoEditar?: {
    id: string;
    nombre: string;
    permisos: string[];
  },
) => {
  const isEdit = Boolean(dataGrupoEditar);
  const form = useForm<CrearGrupoSchema>({
    resolver: zodResolver(crearGrupoSchema),
    defaultValues: {
      nombre: isEdit ? dataGrupoEditar?.nombre : "",
      permisos: isEdit ? dataGrupoEditar?.permisos.map((permiso) => parseInt(permiso)) : [],
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
