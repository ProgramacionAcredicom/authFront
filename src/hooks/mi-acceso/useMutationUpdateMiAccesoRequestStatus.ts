import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { MI_ACCESO_STATUS_LABELS } from "@/app/admin/mis-solicitudes/mi-acceso.constants";
import type { UpdateAccessRequestStatusPayload } from "@/interfaces/mi-acceso.interfaces";
import { updateMiAccesoRequestStatus } from "@/services/mi-acceso/mi-acceso.services";

type MiAccesoApiError = AxiosError<{ message?: string; error?: string; detail?: string }>;

interface UseMutationUpdateMiAccesoRequestStatusOptions {
  onSuccess?: () => void;
}

export interface UpdateMiAccesoRequestStatusMutationVariables extends UpdateAccessRequestStatusPayload {
  id: number;
}

export const useMutationUpdateMiAccesoRequestStatus = (
  options?: UseMutationUpdateMiAccesoRequestStatusOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateMiAccesoRequestStatusMutationVariables) =>
      updateMiAccesoRequestStatus(id, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["mi-acceso-admin-requests"] });

      toast.success("Estado actualizado", {
        description: `La solicitud cambió a ${MI_ACCESO_STATUS_LABELS[variables.status].toLowerCase()}.`,
      });

      options?.onSuccess?.();
    },
    onError: (error: MiAccesoApiError) => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "No se pudo actualizar el estado de la solicitud.";

      toast.error(errorMessage);
    },
  });
};
