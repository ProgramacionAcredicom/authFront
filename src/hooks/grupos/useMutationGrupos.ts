import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { createGrupo, deleteGrupo, updateGrupo } from "@/services/grupos/grupos.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface ErrorResponse {
  error: string;
}

export const useMutationGrupos = () => {
  const queryClient = useQueryClient();

  const mutationGrupos = useMutation({
    mutationFn: createGrupo,
    onMutate: async (grupo) => {
      await queryClient.cancelQueries({ queryKey: ["grupos"] });
      const previousGrupos = queryClient.getQueryData<GruposTypeModel[]>(["grupos"]);
      const newGrupo: GruposTypeModel = {
        id: Date.now(),
        nombre: grupo.nombre,
        permisos: grupo.permisos.map((id) => ({ id, nombre: "" })),
      };
      queryClient.setQueryData<GruposTypeModel[]>(["grupos"], (old) => [...(old || []), newGrupo]);
      return { previousGrupos };
    },
    onError: (error: AxiosError<ErrorResponse>, newGrupo, context) => {
      toast.error(error.response?.data.error || "Error al crear el grupo");
      queryClient.setQueryData<GruposTypeModel[]>(["grupos"], context?.previousGrupos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
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
    onMutate: async (grupo) => {
      await queryClient.cancelQueries({ queryKey: ["grupos"] });
      const previousGrupos = queryClient.getQueryData<GruposTypeModel[]>(["grupos"]);
      const newGrupo: GruposTypeModel = {
        id: Date.now(),
        nombre: grupo.data.nombre,
        permisos: [...new Set(grupo.data.permisos)].map((id) => ({ id, nombre: "" })),
      };
      queryClient.setQueryData<GruposTypeModel[]>(["grupos"], (old) => [...(old || []), newGrupo]);
      return { previousGrupos };
    },
    onError: (error: AxiosError<ErrorResponse>, newGrupo, context) => {
      toast.error(error.response?.data.error || "Error al crear el grupo");
      queryClient.setQueryData<GruposTypeModel[]>(["grupos"], context?.previousGrupos);
    },
    onSuccess: (data: GruposTypeModel) => {
      toast.success(`Grupo ${data.nombre} actualizado correctamente`);
      navigate("..", { replace: true });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
  });
  return { mutationUpdateGrupo, isLoading: mutationUpdateGrupo.isPending };
};

export const useMutationEliminarGrupo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutationEliminarGrupo = useMutation({
    mutationFn: (data: { id: string }) => deleteGrupo(data.id),
    onMutate: async (grupo) => {
      await queryClient.cancelQueries({ queryKey: ["grupos"] });
      const previousGrupos = queryClient.getQueryData<GruposTypeModel[]>(["grupos"]);
      queryClient.setQueryData<GruposTypeModel[]>(["grupos"], (old) => old?.filter((g) => g.id !== Number(grupo.id)));
      return { previousGrupos };
    },
    onError: (error: AxiosError<ErrorResponse>, newGrupo, context) => {
      toast.error(error.response?.data.error || "Error al desactivar el grupo");
      queryClient.setQueryData<GruposTypeModel[]>(["grupos"], context?.previousGrupos);
    },
    onSuccess: (data: { message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      toast.success(data.message || "Grupo desactivado correctamente");
      navigate("..", { replace: true });
    },
  });
  return { mutationEliminarGrupo, isLoading: mutationEliminarGrupo.isPending };
};
