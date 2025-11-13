import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllColaboradores } from "@/services/colaboradores/colaboradores.services";
import { CACHE_TIMES, PAGINATION } from "@/config/constants";

interface FilterParams {
  nombre?: string;
  puesto?: string;
  agencia?: string;
}

/**
 * Query infinita para obtener colaboradores con scroll infinito
 * staleTime: 2 minutos (datos que pueden cambiar más frecuentemente)
 */
export const useInfiniteColaboradores = (globalFilter: string = "", filters?: FilterParams) => {
  // Construir el filtro combinado
  const searchFilter = globalFilter || "";
  
  return useInfiniteQuery({
    queryKey: ["colaboradores-infinite", globalFilter, filters],
    queryFn: ({ pageParam = 1 }) => getAllColaboradores({ pageIndex: pageParam, pageSize: PAGINATION.DEFAULT_PAGE_SIZE }, searchFilter),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
      return nextPage;
    },
    staleTime: CACHE_TIMES.DYNAMIC_DATA,
    gcTime: CACHE_TIMES.DYNAMIC_DATA_GC,
  });
};
