import { useMutation } from "@tanstack/react-query";
import { updateColaborador } from "@/services/colaboradores/colaboradores.services";
import { CrearColaboradorType } from "@/interfaces/colaboradores.interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosRequestConfig } from "axios";

export const useMutationUpdateColaborador = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data, config }: { id: number; data: CrearColaboradorType; config: AxiosRequestConfig }) =>
      updateColaborador(id, data, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  return { mutation };
};
