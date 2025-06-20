import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllColaboradores } from "@/services/colaboradores/colaboradores.services";

export const useInfiniteColaboradores = (globalFilter: string = "") => {
  return useInfiniteQuery({
    queryKey: ["colaboradores-infinite", globalFilter],
    queryFn: ({ pageParam = 1 }) => getAllColaboradores({ pageIndex: pageParam, pageSize: 5 }, globalFilter),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
      return nextPage;
    },
  });
};
