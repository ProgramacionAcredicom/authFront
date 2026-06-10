import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PuestoWritePayload } from "@/interfaces/puestos.interfaces";
import { createPuesto, deletePuesto, updatePuesto } from "@/services/puestos/puestos.services";

interface ErrorResponse {
  error?: string;
  detail?: string;
}

const getErrorMessage = (error: AxiosError<ErrorResponse>, fallback: string) =>
  error.response?.data?.error || error.response?.data?.detail || error.message || fallback;

const invalidatePuestosQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["puestos"] }),
    queryClient.invalidateQueries({ queryKey: ["puesto"] }),
    queryClient.invalidateQueries({ queryKey: ["roles"] }),
  ]);
};

export const useMutationPuestos = () => {
  const queryClient = useQueryClient();

  const mutationPuestos = useMutation({
    mutationFn: (payload: PuestoWritePayload) => createPuesto({ ...payload, grupos: [...new Set(payload.grupos)] }),
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error, "Error al crear el puesto"));
    },
    onSuccess: (data) => {
      toast.success(`Puesto ${data.role} creado correctamente`);
    },
    onSettled: async () => {
      await invalidatePuestosQueries(queryClient);
    },
  });

  return {
    mutationPuestos,
    isLoading: mutationPuestos.isPending,
  };
};

export const useMutationUpdatePuesto = () => {
  const queryClient = useQueryClient();

  const mutationUpdatePuesto = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PuestoWritePayload }) =>
      updatePuesto(id, { ...data, grupos: [...new Set(data.grupos)] }),
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error, "Error al actualizar el puesto"));
    },
    onSuccess: (data) => {
      toast.success(`Puesto ${data.role} actualizado correctamente`);
    },
    onSettled: async () => {
      await invalidatePuestosQueries(queryClient);
    },
  });

  return {
    mutationUpdatePuesto,
    isLoading: mutationUpdatePuesto.isPending,
  };
};

export const useMutationEliminarPuesto = () => {
  const queryClient = useQueryClient();

  const mutationEliminarPuesto = useMutation({
    mutationFn: ({ id }: { id: string }) => deletePuesto(id),
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(getErrorMessage(error, "Error al desactivar el puesto"));
    },
    onSuccess: (data) => {
      toast.success(`Puesto ${data.role} desactivado correctamente`);
    },
    onSettled: async () => {
      await invalidatePuestosQueries(queryClient);
    },
  });

  return {
    mutationEliminarPuesto,
    isLoading: mutationEliminarPuesto.isPending,
  };
};
