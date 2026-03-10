import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeSessions, closeSessionsAdmin } from "@/services/auth/sessions.services";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useMutationCloseSessions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (sessionIds: number[]) => closeSessions(sessionIds),
    onSuccess: (_data, sessionIds) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      const count = sessionIds.length;
      toast.success(
        count === 1 
          ? "Sesión cerrada correctamente" 
          : `${count} sesiones cerradas correctamente`
      );
    },
    onError: (error: AxiosError<{ message?: string; error?: string }>) => {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Error al cerrar la(s) sesión(es)";
      toast.error(errorMessage);
    },
  });

  return {
    mutation,
    isLoading: mutation.isPending,
  };
};

export const useMutationCloseSessionsAdmin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (sessionIds: number[]) => closeSessionsAdmin(sessionIds),
    onSuccess: (_data, sessionIds) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      const count = sessionIds.length;
      toast.success(
        count === 1
          ? "Sesión cerrada correctamente"
          : `${count} sesiones cerradas correctamente`
      );
    },
    onError: (error: AxiosError<{ message?: string; error?: string }>) => {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Error al cerrar la(s) sesión(es)";
      toast.error(errorMessage);
    },
  });

  return {
    mutation,
    isLoading: mutation.isPending,
  };
};

