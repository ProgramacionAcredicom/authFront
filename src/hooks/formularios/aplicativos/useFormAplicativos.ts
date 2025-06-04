import { useMutationAplicativos, useMutationUpdateAplicativo } from "@/hooks/aplicativos/useMutationAplicativos";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import { asignarAplicativosSchema, AsignarAplicativosSchema } from "@/schemas/aplicativos/asignar-aplicativos.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useFormAplicativos = (data: AplicativosTypeModel, setOpen: (open: boolean) => void, isEdit: boolean, id: string) => {
  console.log(data);
  const form = useForm<AsignarAplicativosSchema>({
    resolver: zodResolver(asignarAplicativosSchema),
    defaultValues: {
      nombre: data?.nombre || "",
      descripcion: data?.descripcion || "",
      configuracion: data?.configuracion ? JSON.stringify(data.configuracion, null, 2) : "{}",
    },
    mode: "onChange",
  });

  const { mutationAplicativos, isLoading } = useMutationAplicativos();
  const { mutation } = useMutationUpdateAplicativo();

  const onSubmit = async (formData: AsignarAplicativosSchema) => {
    // formData.configuracion es un string. Lo parseamos:
    let parsedConfig: Record<string, any>;
    try {
      parsedConfig = JSON.parse(formData.configuracion);
    } catch (e) {
      console.error("JSON inválido en campo configuracion:", e);
      return; // aquí podrías mostrar un error al usuario en vez de continuar
    }

    const payload: Omit<AplicativosTypeModel, "id"> = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      // Envío como objeto, no como string
      configuracion: parsedConfig,
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
