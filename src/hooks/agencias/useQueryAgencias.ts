import { getAllAgencias } from "@/services/agencias/agencias.services";
import { useQuery } from "@tanstack/react-query";
import { CACHE_TIMES } from "@/config/constants";

interface UseQueryAgenciasOptions {
  enabled?: boolean;
}

/**
 * Query para obtener todas las agencias
 * staleTime: 10 minutos (datos relativamente estáticos, se usan para selects)
 */
export const useQueryAgencias = (options?: UseQueryAgenciasOptions) => {
  const queryAgencias = useQuery({
    queryKey: ["agencias"],
    queryFn: getAllAgencias,
    staleTime: CACHE_TIMES.STATIC_DATA,
    gcTime: CACHE_TIMES.STATIC_DATA_GC,
    enabled: options?.enabled ?? true,
  });
  return { queryAgencias };
};
