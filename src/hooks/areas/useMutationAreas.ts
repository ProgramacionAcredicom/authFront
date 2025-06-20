import { AreasPaginationType } from "@/interfaces/areas.interfaces";
import { crearArea, actualizarAreas } from "@/services/areas/areas.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AreasSchema } from "@/schemas/areas/areas.schemas";

export const MutationAreas = (closeModal: () => void) => {
  const queryClient = useQueryClient();

  const mutationAreas = useMutation({
    mutationFn: crearArea,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["areas"] });
      const previousAreas = queryClient.getQueryData<AreasPaginationType>(["areas"]);

      queryClient.setQueryData<AreasPaginationType>(["areas"], (old) => {
        if (!old) {
          return {
            total: 1,
            page: 1,
            page_size: 10,
            total_pages: 1,
            results: [],
          };
        }
        return {
          ...old,
          total: old.total + 1,
          results: [...old.results],
        };
      });
      return { previousAreas };
    },

    onError: (error, newAgencia, context) => {
      console.log(error);
      toast.error("Error al crear el area");
      if (context?.previousAreas) {
        queryClient.setQueryData<AreasPaginationType>(["areas"], context.previousAreas);
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData<AreasPaginationType>(["areas"], (old) => {
        if (!old) return old;
        return {
          ...old,
          total: old.total + 1,
          results: [...old.results, data],
        };
      });
      toast.success(`Se ha creado el área ${data.name} correctamente`);
      closeModal();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });

  return mutationAreas;
};

export const MutationUpdateAreas = (closeModal: () => void) => {
  const queryClient = useQueryClient();

  const mutationUpdateAreas = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AreasSchema }) => actualizarAreas(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["areas"] });
      const previousAreas = queryClient.getQueryData<AreasPaginationType>(["areas"]);

      queryClient.setQueryData<AreasPaginationType>(["areas"], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((area) =>
            area.id === id
              ? {
                  ...area,
                  code: data.code,
                  name: data.name,
                  chif: { id: data.chif, name: "", email: "" }, // Se actualizará con los datos reales del servidor
                  state: data.state,
                }
              : area,
          ),
        };
      });
      return { previousAreas };
    },

    onError: (error, variables, context) => {
      toast.error("Error al actualizar el área");
      if (context?.previousAreas) {
        queryClient.setQueryData<AreasPaginationType>(["areas"], context.previousAreas);
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData<AreasPaginationType>(["areas"], (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((area) => (area.id === data.id ? data : area)),
        };
      });
      toast.success(`Se ha actualizado el área ${data.name} correctamente`);
      closeModal();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });

  return mutationUpdateAreas;
};
