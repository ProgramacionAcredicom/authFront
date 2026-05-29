import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { sendMovementReport } from "@/services/movements/movements.services";

type MovementReportApiError = AxiosError<{ message?: string; error?: string; detail?: string }>;

export const useMutationMovementReport = () => {
  const mutation = useMutation({
    mutationFn: sendMovementReport,
    onError: (error: MovementReportApiError) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "No se pudo enviar la reportería de movimientos.";

      toast.error(errorMessage);
    },
  });

  return {
    mutation,
    isLoading: mutation.isPending,
  };
};
