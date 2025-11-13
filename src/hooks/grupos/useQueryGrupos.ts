import { getAllGrupos, getAllGruposSinPaginacion, getGrupoById } from "@/services/grupos/grupos.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryGrupos = (params?: { page?: number; page_size?: number; search?: string }) => {
  const queryGrupos = useQuery({
    queryKey: ["grupos", params],
    queryFn: () => getAllGrupos(params),
  });
  return {
    queryGrupos,
  };
};

export const useQueryGruposSinPaginacion = () => {
  const queryGruposSinPaginacion = useQuery({
    queryKey: ["grupos-sinPaginacion"],
    queryFn: getAllGruposSinPaginacion,
  });
  return {
    queryGruposSinPaginacion,
  };
};

export const useQueryGruposById = (id: string) => {
  const queryGruposById = useQuery({
    queryKey: ["grupos", id],
    queryFn: () => getGrupoById(id),
  });
  return {
    queryGruposById,
  };
};
