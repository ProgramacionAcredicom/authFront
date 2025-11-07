import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllColaboradores } from "@/services/colaboradores/colaboradores.services";

interface FilterParams {
  nombre?: string;
  puesto?: string;
  agencia?: string;
}

export const useInfiniteColaboradores = (globalFilter: string = "", filters?: FilterParams) => {
  // Construir el filtro combinado
  const searchFilter = globalFilter || "";
  
  return useInfiniteQuery({
    queryKey: ["colaboradores-infinite", globalFilter, filters],
    queryFn: ({ pageParam = 1 }) => getAllColaboradores({ pageIndex: pageParam, pageSize: 20 }, searchFilter),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
      return nextPage;
    },
  });
};
