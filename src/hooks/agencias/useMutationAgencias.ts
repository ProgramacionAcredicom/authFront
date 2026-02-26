import { createAgencia, updateAgencia } from "@/services/agencias/agencias.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AgenciasSchema } from "@/schemas/agencias/agencias.schemas";
import { AgenciasModelTypes } from "@/interfaces/agencias.interfaces";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { generateTempId } from "@/lib/id-generator";
import { logger } from "@/lib/logger";

type MutationContext = {
  previousAgencias: AgenciasSchema[] | undefined;
};
interface ApiErrorResponse {
  code: string[];
  name: string[];
  error: string[];
  detail?: string;
  [key: string]: unknown;
}

export const MutationAgencias = (closeModal: () => void) => {
  const queryClient = useQueryClient();

  const mutationAgencias = useMutation<AgenciasModelTypes, Error, AgenciasSchema, MutationContext>({
    mutationFn: createAgencia,

    onMutate: async (newAgencia: AgenciasSchema) => {
      await queryClient.cancelQueries({ queryKey: ["agencias"] });

      const previousAgencias = queryClient.getQueryData<AgenciasSchema[]>(["agencias"]);

      queryClient.setQueryData<AgenciasModelTypes[]>(["agencias"], (old: AgenciasModelTypes[] = []) => [
        ...old,
        {
          ...newAgencia,
          id: generateTempId(),
          chif: null,
          no_colaboradores: 0,
        },
      ]);
      return { previousAgencias };
    },

    onError: (error, newAgencia, context) => {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const { data } = axiosError.response || {};
        if (data?.code?.some((msg) => msg.toLowerCase().includes("code already exists"))) {
          return toast.error("Ya existe una agencia con este CÓDIGO");
        }

        if (data?.name?.some((msg) => msg.toLowerCase().includes("name already exists"))) {
          return toast.error("Ya existe una agencia con este NOMBRE");
        }

        toast.error(data?.error || "Error al crear la agencia");
      } else {
        toast.error("Error al crear la agencia");
      }

      queryClient.setQueryData<AgenciasSchema[]>(["agencias"], context?.previousAgencias);
    },

    onSuccess: (data: AgenciasModelTypes) => {
      toast.success(`Se ha creado la agencia ${data.name} correctamente`);
      closeModal();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["agencias"] });
    },
  });

  return mutationAgencias;
};

export const MutationUpdateAgencia = (closeModal: () => void) => {
  const queryClient = useQueryClient();
  const mutationUpdateAgencia = useMutation<Omit<AgenciasModelTypes, "no_colaboradores">, Error, { id: number; data: AgenciasSchema }>({
    mutationFn: ({ id, data }) => {
      // TODO: El backend espera chif como número (ID), pero la interfaz espera Chif | null
      // Esto necesita ser corregido en el backend o crear un mapper apropiado
      // Por ahora, validamos que chif sea un número antes de enviarlo
      if (typeof data.chif !== 'number') {
        throw new Error('chif debe ser un número (ID)');
      }
      return updateAgencia(id, {
        ...data,
        id,
        // El backend espera el ID del chif, no el objeto completo
        // Este es un problema de diseño que necesita ser resuelto
        chif: null, // Temporal: el backend debería aceptar el ID directamente
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const { data } = axiosError.response || {};
        logger.errorWithContext("Error al actualizar agencia", error, { responseData: data });
        if (data?.code?.some((msg) => msg.toLowerCase().includes("code already exists"))) {
          return toast.error("Ya existe una agencia con este CÓDIGO");
        }

        if (data?.name?.some((msg) => msg.toLowerCase().includes("name already exists"))) {
          return toast.error("Ya existe una agencia con este NOMBRE");
        }
        if (data?.error) {
          return toast.error(data?.error);
        }
      } else {
        toast.error("Error al actualizar la agencia");
      }
    },
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["agencias"] });
    },
  });

  return mutationUpdateAgencia;
};
