import { PermisosTypeModel, ResultModel } from "@/interfaces/permisos.interfaces";
import { createPermiso, deletePermiso, updatePermiso } from "@/services/permisos/permisos.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { generateTempId } from "@/lib/id-generator";

export const useMutationPermisos = () => {
  const queryClient = useQueryClient();
  const mutatePermiso = useMutation({
    mutationFn: createPermiso,
    onMutate: async (permiso) => {
      await queryClient.cancelQueries({ queryKey: ["permisos"] });
      const previousPermisos = queryClient.getQueryData<PermisosTypeModel>(["permisos"]);

      queryClient.setQueryData<PermisosTypeModel>(["permisos"], (old) => {
        if (!old) return old;
        const newResult: ResultModel = {
          id: generateTempId(),
          nombre: permiso.permisos[0].nombre,
          descripcion: permiso.permisos[0].descripcion,
          aplicativo: {
            id: permiso.permisos[0].aplicativo,
            nombre: "", // This will be updated when the query is invalidated
          },
        };
        return {
          ...old,
          results: [...old.results, newResult],
        };
      });

      return { previousPermisos };
    },
    onError: (error: AxiosError<{ error?: string; nombre?: string }>, _newPermiso, context) => {
      if (context?.previousPermisos) {
        queryClient.setQueryData<PermisosTypeModel>(["permisos"], context.previousPermisos);
      }
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.nombre 
        || error.message 
        || "Error al crear el permiso";
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
    },
    onSuccess: (data: ResultModel) => {
      toast.success(`Permiso ${data.nombre} creado correctamente`);
    },
  });

  return {
    mutatePermiso,
    isLoading: mutatePermiso.isPending,
  };
};

export const useMutationEditarPermiso = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutatePermiso = useMutation({
    mutationFn: ({
      id,
      permiso,
    }: {
      id: string;
      permiso: {
        nombre: string;
        descripcion: string;
      };
    }) => updatePermiso(permiso, id),
    onMutate: async (permiso) => {
      await queryClient.cancelQueries({ queryKey: ["permisos"] });
      const previousPermisos = queryClient.getQueryData<PermisosTypeModel>(["permisos"]);
      queryClient.setQueryData<PermisosTypeModel>(["permisos"], (old) => {
        if (!old) return old;
        // Mantener el aplicativo original del permiso existente
        const existingPermiso = old.results.find((result) => result.id === Number(permiso.id));
        const newResult: ResultModel = {
          id: existingPermiso?.id || generateTempId(),
          nombre: permiso.permiso.nombre,
          descripcion: permiso.permiso.descripcion,
          aplicativo: existingPermiso?.aplicativo || {
            id: 0,
            nombre: "",
          },
        };
        return {
          ...old,
          results: old.results.map((result) => (result.id === Number(permiso.id) ? newResult : result)),
        };
      });
      return { previousPermisos };
    },
    onError: (error: AxiosError<{ error?: string; nombre?: string }>, _newPermiso, context) => {
      if (context?.previousPermisos) {
        queryClient.setQueryData<PermisosTypeModel>(["permisos"], context.previousPermisos);
      }
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.nombre 
        || error.message 
        || "Error al actualizar el permiso";
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
    onSuccess: (data: ResultModel) => {
      toast.success(`Permiso ${data.nombre} actualizado correctamente`);
      navigate("..", { replace: true });
    },
  });

  return {
    mutatePermiso,
    isLoading: mutatePermiso.isPending,
  };
};

export const useMutationEliminarPermiso = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutatePermiso = useMutation<
    { message: string },
    AxiosError<{ error?: string; nombre?: string }>,
    { id: string },
    { previousPermisos: PermisosTypeModel | undefined }
  >({
    mutationFn: ({ id }: { id: string }) => deletePermiso(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["permisos"] });
      const previousPermisos = queryClient.getQueryData<PermisosTypeModel>(["permisos"]);
      queryClient.setQueryData<PermisosTypeModel>(["permisos"], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.filter((result) => result.id !== Number(id)),
        };
      });
      return { previousPermisos };
    },
    onError: (error: AxiosError<{ error?: string; nombre?: string }>, _newPermiso, context) => {
      if (context?.previousPermisos) {
        queryClient.setQueryData<PermisosTypeModel>(["permisos"], context.previousPermisos);
      }
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.nombre 
        || error.message 
        || "Error al eliminar el permiso";
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
      queryClient.invalidateQueries({ queryKey: ["grupos"] });
    },
    onSuccess: (data: { message: string }) => {
      toast.success(`${data.message || "Permiso eliminado correctamente"}`);
      navigate("..", { replace: true });
    },
  });

  return {
    mutatePermiso,
    isLoading: mutatePermiso.isPending,
  };
};
