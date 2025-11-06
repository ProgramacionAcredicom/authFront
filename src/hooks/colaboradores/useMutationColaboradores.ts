import { useMutation } from "@tanstack/react-query";
import { updateColaborador, ColaboradorFormData } from "@/services/colaboradores/colaboradores.services";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosRequestConfig } from "axios";

export const useMutationUpdateColaborador = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data, config }: { id: number; data: ColaboradorFormData; config: AxiosRequestConfig }) =>
      updateColaborador(id, data, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Error al actualizar el colaborador");
    },
  });

  return { mutation };
};
