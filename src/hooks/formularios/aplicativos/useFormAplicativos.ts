import { useMutationAplicativos, useMutationUpdateAplicativo } from "@/hooks/aplicativos/useMutationAplicativos";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import { asignarAplicativosSchema, AsignarAplicativosSchema } from "@/schemas/aplicativos/asignar-aplicativos.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const useFormAplicativos = (data: AplicativosTypeModel, setOpen: (open: boolean) => void, isEdit: boolean, id: string) => {
  const form = useForm<AsignarAplicativosSchema>({
    resolver: zodResolver(asignarAplicativosSchema),
    defaultValues: {
      nombre: data?.nombre || "",
      descripcion: data?.descripcion || "",
      configuracion: data?.configuracion ? JSON.stringify(data.configuracion, null, 2) : "{}",
      state: data?.state || false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      nombre: data.nombre,
      descripcion: data.descripcion,
      configuracion: data.configuracion ? JSON.stringify(data.configuracion, null, 2) : "{}",
      state: data.state,
    });
  }, [data, form]);

  const { mutationAplicativos, isLoading } = useMutationAplicativos();
  const { mutation, isLoading: isLoadingUpdate } = useMutationUpdateAplicativo();

  const onSubmit = async (formData: AsignarAplicativosSchema) => {
    // formData.configuracion es un string. Lo parseamos:
    let parsedConfig: Record<string, unknown>;
    try {
      parsedConfig = JSON.parse(formData.configuracion);
    } catch (e) {
      console.error("JSON inválido en campo configuracion:", e);
      return; // aquí podrías mostrar un error al usuario en vez de continuar
    }

    const payload: Omit<AplicativosTypeModel, "id"> = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      configuracion: parsedConfig,
      state: formData.state,
    };

    if (isEdit) {
      await mutation.mutateAsync({ id, data: payload });
    } else {
      await mutationAplicativos.mutateAsync(payload);
    }
    setOpen(false);
    form.reset();
  };

  return { form, onSubmit, isLoading: isLoading || isLoadingUpdate };
};
