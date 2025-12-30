import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { createGrupo, deleteGrupo, updateGrupo } from "@/services/grupos/grupos.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface ErrorResponse {
  error?: string;
}

export const useMutationGrupos = () => {
  const queryClient = useQueryClient();

  const mutationGrupos = useMutation({
    mutationFn: createGrupo,
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.error 
        || error.message 
        || "Error al crear el grupo";
      toast.error(errorMessage);
    },
    onSettled: () => {
      // Invalidar todas las queries de grupos (paginadas, sin paginar e infinite)
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["grupos-sinPaginacion"] });
      queryClient.invalidateQueries({ queryKey: ["grupos-infinite"] });
    },
    onSuccess: (data: GruposTypeModel) => {
      toast.success(`Grupo ${data.nombre} creado correctamente`);
    },
  });
  return {
    mutationGrupos,
    isLoading: mutationGrupos.isPending,
  };
};

interface CreateGrupoDTO {
  nombre: string;
  permisos: number[];
  users_ids?: number[];
}

export const useMutationUpdateGrupo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutationUpdateGrupo = useMutation({
    mutationFn: (data: { id: string; data: CreateGrupoDTO }) => {
      // Remove duplicate permission IDs
      const uniquePermisos = [...new Set(data.data.permisos)];
      return updateGrupo(data.id, { ...data.data, permisos: uniquePermisos });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.error 
        || error.message 
        || "Error al actualizar el grupo";
      toast.error(errorMessage);
    },
    onSuccess: (data: GruposTypeModel) => {
      toast.success(`Grupo ${data.nombre} actualizado correctamente`);
      navigate("..", { replace: true });
    },
    onSettled: () => {
      // Invalidar todas las queries de grupos (paginadas, sin paginar e infinite)
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["grupos-sinPaginacion"] });
      queryClient.invalidateQueries({ queryKey: ["grupos-infinite"] });
    },
  });
  return { mutationUpdateGrupo, isLoading: mutationUpdateGrupo.isPending };
};

export const useMutationEliminarGrupo = (shouldNavigate = true) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutationEliminarGrupo = useMutation({
    mutationFn: (data: { id: string }) => deleteGrupo(data.id),
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.error 
        || error.message 
        || "Error al desactivar el grupo";
      toast.error(errorMessage);
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message || "Grupo desactivado correctamente");
      // Solo navegar si se especifica (útil cuando se elimina desde un modal de edición)
      if (shouldNavigate) {
        navigate("..", { replace: true });
      }
    },
    onSettled: () => {
      // Invalidar todas las queries de grupos (paginadas, sin paginar e infinite)
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      queryClient.invalidateQueries({ queryKey: ["grupos-sinPaginacion"] });
      queryClient.invalidateQueries({ queryKey: ["grupos-infinite"] });
    },
  });
  return { mutationEliminarGrupo, isLoading: mutationEliminarGrupo.isPending };
};
