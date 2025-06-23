import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import { createAplicativo, deleteAplicativo, updateAplicativo } from "@/services/aplicativos/aplicativos.services";
type MutationContext = {
  previousAplicativos: AplicativosTypeModel[] | undefined;
};

interface ApiErrorResponse {
  code: string[];
  name: string[];
  error: string[];
  detail?: string;
  [key: string]: unknown;
}

export const useMutationAplicativos = () => {
  const queryClient = useQueryClient();
  const mutationAplicativos = useMutation<AplicativosTypeModel, Error, Omit<AplicativosTypeModel, "id">, MutationContext>({
    mutationFn: createAplicativo,

    onMutate: async (newAplicativo: Omit<AplicativosTypeModel, "id">) => {
      await queryClient.cancelQueries({ queryKey: ["aplicativos"] });

      const previousAplicativos = queryClient.getQueryData<AplicativosTypeModel[]>(["aplicativos"]);

      queryClient.setQueryData<AplicativosTypeModel[]>(["aplicativos"], (old: AplicativosTypeModel[] = []) => [
        ...old,
        {
          ...newAplicativo,
          id: Date.now(),
        },
      ]);
      return { previousAplicativos };
    },

    onError: (error, newAplicativo, context) => {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const { data } = axiosError.response || {};
        if (data?.code?.some((msg) => msg.toLowerCase().includes("code already exists"))) {
          return toast.error("Ya existe un aplicativo con este CÓDIGO");
        }

        if (data?.name?.some((msg) => msg.toLowerCase().includes("name already exists"))) {
          return toast.error("Ya existe un aplicativo con este NOMBRE");
        }

        toast.error(data?.error || "Error al crear el aplicativo");
      } else {
        toast.error("Error al crear el aplicativo");
      }

      queryClient.setQueryData<AplicativosTypeModel[]>(["aplicativos"], context?.previousAplicativos);
    },

    onSuccess: (data: AplicativosTypeModel) => {
      toast.success(`Se ha creado el aplicativo ${data.nombre} correctamente`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["aplicativos"] });
    },
  });

  return { mutationAplicativos, isLoading: mutationAplicativos.isPending };
};

export const useMutationUpdateAplicativo = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<AplicativosTypeModel, "id"> }) => updateAplicativo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aplicativos"] });
      toast.success("Aplicativo actualizado correctamente");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  return { mutation, isLoading: mutation.isPending };
};

export const useMutationDeleteAplicativo = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<{ message: string }, Error, { id: string }>({
    mutationFn: ({ id }: { id: string }) => deleteAplicativo(id),
    onSuccess: (data: { message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["aplicativos"] });
      toast.success(data.message || "Aplicativo desactivado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { mutation, isLoading: mutation.isPending };
};
