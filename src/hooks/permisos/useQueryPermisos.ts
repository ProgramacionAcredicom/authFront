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
    queryFn: ({ pageParam = 0 }) => getAllPermisos({ pageIndex: pageParam, pageSize: 5 }, globalFilter),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page < lastPage.total_pages ? lastPage.page : undefined;
      return nextPage;
    },
  });

  return {
    queryPermisos,
    queryPermisosById,
    useInfinitePermisos,
  };
};
