import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useMutationPuestos, useMutationUpdatePuesto } from "@/hooks/puestos/useMutationPuestos";
import { PuestoSchema, puestoSchema } from "@/schemas/puestos/puestos.schema";

interface PuestoEditData {
  id: string;
  role: string;
  grupos: number[];
  state: boolean;
}

export const useFormPuestos = (setOpen: (open: boolean) => void, dataPuestoEditar?: PuestoEditData) => {
  const isEdit = Boolean(dataPuestoEditar);

  const form = useForm<PuestoSchema>({
    resolver: zodResolver(puestoSchema),
    defaultValues: {
      role: dataPuestoEditar?.role ?? "",
      grupos: dataPuestoEditar?.grupos ?? [],
      state: dataPuestoEditar?.state ?? true,
    },
    mode: "onChange",
  });

  const { mutationPuestos, isLoading: isLoadingCreate } = useMutationPuestos();
  const { mutationUpdatePuesto, isLoading: isLoadingUpdate } = useMutationUpdatePuesto();

  const onSubmit = async (data: PuestoSchema) => {
    const payload = {
      role: data.role.trim(),
      grupos: data.grupos,
      state: data.state,
    };

    if (isEdit && dataPuestoEditar) {
      await mutationUpdatePuesto.mutateAsync({
        id: dataPuestoEditar.id,
        data: payload,
      });
    } else {
      await mutationPuestos.mutateAsync(payload);
    }

    setOpen(false);
    form.reset({
      role: "",
      grupos: [],
      state: true,
    });
  };

  return {
    form,
    onSubmit,
    isLoading: isEdit ? isLoadingUpdate : isLoadingCreate,
  };
};
