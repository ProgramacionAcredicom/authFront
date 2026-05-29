import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { createMovements } from "@/services/movements/movements.services";

type MovementsApiError = AxiosError<{ message?: string; error?: string; detail?: string }>;

export const useMutationCreateMovements = () => {
  const mutation = useMutation({
    mutationFn: createMovements,
    onError: (error: MovementsApiError) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "No se pudieron registrar los movimientos.";

      toast.error(errorMessage);
    },
  });

  return {
    mutation,
    isLoading: mutation.isPending,
  };
};
