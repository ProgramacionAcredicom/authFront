import { useMutationAplicativos, useMutationUpdateAplicativo } from "@/hooks/aplicativos/useMutationAplicativos";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import { asignarAplicativosSchema, AsignarAplicativosSchema } from "@/schemas/aplicativos/asignar-aplicativos.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useFormAplicativos = (
  data: {
    nombre: string;
    descripcion: string;
    configuracion: { [x: string]: unknown } | null;
  },
  setOpen: (open: boolean) => void,
  isEdit: boolean,
  id: string,
) => {
  const form = useForm<AsignarAplicativosSchema>({
    resolver: zodResolver(asignarAplicativosSchema),
    defaultValues: {
      nombre: data?.nombre || "",
      descripcion: data?.descripcion || "",
      configuracion: data?.configuracion ? JSON.stringify(data.configuracion, null, 2) : "",
    },
    mode: "onChange",
  });

  const { mutationAplicativos, isLoading } = useMutationAplicativos();
  const { mutation } = useMutationUpdateAplicativo();

  const onSubmit = async (data: AsignarAplicativosSchema) => {
    const payload: Omit<AplicativosTypeModel, "id"> = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      configuracion: data.configuracion,
    };
    if (isEdit) {
      await mutation.mutateAsync({ id, data: payload });
    } else {
      await mutationAplicativos.mutateAsync(payload);
    }
    setOpen(false);
    form.reset();
  };

  return { form, onSubmit, isLoading };
};
