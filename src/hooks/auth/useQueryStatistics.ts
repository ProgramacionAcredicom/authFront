import { getStatistics } from "@/services/auth/auth.services";
import { useQuery } from "@tanstack/react-query";
import { CACHE_TIMES } from "@/config/constants";

/**
 * Hook para obtener estadísticas del sistema
 * staleTime: 5 minutos (datos relativamente estáticos)
 */
export const useQueryStatistics = () => {
  const queryStatistics = useQuery({
    queryKey: ["statistics"],
    queryFn: () => getStatistics(),
    staleTime: CACHE_TIMES.SEMI_STATIC_DATA,
    gcTime: CACHE_TIMES.SEMI_STATIC_DATA_GC,
  });

  return {
    queryStatistics,
  };
};

