import { getAllGrupos, getAllGruposSinPaginacion, getGrupoById } from "@/services/grupos/grupos.services";
import { useQuery } from "@tanstack/react-query";
import { CACHE_TIMES } from "@/config/constants";

/**
 * Query para obtener grupos con paginación
 * staleTime: 5 minutos (datos relativamente estáticos)
 */
export const useQueryGrupos = (params?: { 
  page?: number; 
  page_size?: number; 
  search?: string;
  usuario?: string;
  grupo?: string;
  aplicativo?: string;
  ordering?: string;
}) => {
  const queryGrupos = useQuery({
    queryKey: ["grupos", params],
    queryFn: () => getAllGrupos(params),
    staleTime: CACHE_TIMES.SEMI_STATIC_DATA,
    gcTime: CACHE_TIMES.SEMI_STATIC_DATA_GC,
  });
  return {
    queryGrupos,
  };
};

/**
 * Query para obtener todos los grupos sin paginación
 * staleTime: 10 minutos (datos más estáticos, se usan para selects)
 */
export const useQueryGruposSinPaginacion = () => {
  const queryGruposSinPaginacion = useQuery({
    queryKey: ["grupos-sinPaginacion"],
    queryFn: getAllGruposSinPaginacion,
    staleTime: CACHE_TIMES.STATIC_DATA,
    gcTime: CACHE_TIMES.STATIC_DATA_GC,
  });
  return {
    queryGruposSinPaginacion,
  };
};

/**
 * Query para obtener un grupo por ID
 * staleTime: 5 minutos
 */
export const useQueryGruposById = (id: string) => {
  const queryGruposById = useQuery({
    queryKey: ["grupos", id],
    queryFn: () => getGrupoById(id),
    enabled: !!id, // Solo ejecutar si hay un ID
    staleTime: CACHE_TIMES.SEMI_STATIC_DATA,
    gcTime: CACHE_TIMES.SEMI_STATIC_DATA_GC,
  });
  return {
    queryGruposById,
  };
};
