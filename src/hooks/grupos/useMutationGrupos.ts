import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { createGrupo, deleteGrupo, updateGrupo } from "@/services/grupos/grupos.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { generateTempId } from "@/lib/id-generator";

interface ErrorResponse {
  error?: string;
}

export const useMutationGrupos = () => {
  const queryClient = useQueryClient();

  const mutationGrupos = useMutation({
    mutationFn: createGrupo,
    onMutate: async (grupo) => {
      await queryClient.cancelQueries({ queryKey: ["grupos"] });
      const previousGrupos = queryClient.getQueryData<GruposTypeModel[]>(["grupos"]);
      const newGrupo: GruposTypeModel = {
        id: generateTempId(),
        nombre: grupo.nombre,
        permisos: grupo.permisos.map((id) => ({ id, nombre: "" })),
      };
      queryClient.setQueryData<GruposTypeModel[]>(["grupos"], (old) => [...(old || []), newGrupo]);
      return { previousGrupos };
    },
    onError: (error: AxiosError<ErrorResponse>, _newGrupo, context) => {
      const errorMessage = error.response?.data?.error 
        || error.message 
        || "Error al crear el grupo";
      toast.error(errorMessage);
      if (context?.previousGrupos) {
        queryClient.setQueryData<GruposTypeModel[]>(["grupos"], context.previousGrupos);
      }
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
    onMutate: async (grupo) => {
      await queryClient.cancelQueries({ queryKey: ["grupos"] });
      const previousGrupos = queryClient.getQueryData<GruposTypeModel[]>(["grupos"]);
      queryClient.setQueryData<GruposTypeModel[]>(["grupos"], (old) => {
        const existingGrupo = old?.find((g) => g.id === Number(grupo.id));
        const newGrupo: GruposTypeModel = {
          id: existingGrupo?.id || generateTempId(),
          nombre: grupo.data.nombre,
          permisos: [...new Set(grupo.data.permisos)].map((id) => ({ id, nombre: "" })),
        };
        return old?.map((g) => (g.id === Number(grupo.id) ? newGrupo : g)) || [newGrupo];
      });
      return { previousGrupos };
    },
    onError: (error: AxiosError<ErrorResponse>, _newGrupo, context) => {
      const errorMessage = error.response?.data?.error 
        || error.message 
        || "Error al crear el grupo";
      toast.error(errorMessage);
      if (context?.previousGrupos) {
        queryClient.setQueryData<GruposTypeModel[]>(["grupos"], context.previousGrupos);
      }
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
    onError: (error: AxiosError<ErrorResponse>, _newGrupo, context) => {
      const errorMessage = error.response?.data?.error 
        || error.message 
        || "Error al desactivar el grupo";
      toast.error(errorMessage);
      if (context?.previousGrupos) {
        queryClient.setQueryData<GruposTypeModel[]>(["grupos"], context.previousGrupos);
      }
    },
    onSuccess: (data: { message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
      toast.success(data.message || "Grupo desactivado correctamente");
      navigate("..", { replace: true });
    },
  });
  return { mutationEliminarGrupo, isLoading: mutationEliminarGrupo.isPending };
};
