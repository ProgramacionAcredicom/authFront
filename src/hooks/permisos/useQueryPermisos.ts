import { getAllPermisos, getPermisosById } from "@/services/permisos/permisos.services";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useQueryPermisos = (id?: string, globalFilter?: string) => {
  const queryPermisos = useQuery({
    queryKey: ["permisos"],
    queryFn: () => getAllPermisos({ pageIndex: 0, pageSize: 5 }),
  });

  const queryPermisosById = useQuery({
    queryKey: ["permisosById", id],
    queryFn: () => (id ? getPermisosById(id) : null),
    enabled: !!id,
  });

  const useInfinitePermisos = useInfiniteQuery({
    queryKey: ["permisos-infinite", globalFilter],
    queryFn: ({ pageParam = 0 }) => getAllPermisos({ pageIndex: pageParam, pageSize: 220 }, globalFilter),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.results.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });

  return {
    queryPermisos,
    queryPermisosById,
    useInfinitePermisos,
  };
};
