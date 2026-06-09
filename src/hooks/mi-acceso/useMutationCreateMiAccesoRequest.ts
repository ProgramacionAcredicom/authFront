import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { createMiAccesoRequest } from "@/services/mi-acceso/mi-acceso.services";

type MiAccesoApiError = AxiosError<{ message?: string; error?: string; detail?: string }>;

export const useMutationCreateMiAccesoRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMiAccesoRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mi-acceso-requests"] });
    },
    onError: (error: MiAccesoApiError) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "No se pudo registrar la solicitud.";

      toast.error(errorMessage);
    },
  });
};
