import { getAllPermisos, getPermisosById } from "@/services/permisos/permisos.services";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export const useQueryPermisos = (id?: string, searchParam?: string) => {
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [search] = useQueryState("search", parseAsString.withDefault(""));
  
  // Usar searchParam si se proporciona, sino usar el de la URL
  const searchValue = searchParam !== undefined ? searchParam : search;
  
  const pagination = { pageIndex: (page || 1) - 1, pageSize: perPage || 10 };
  
  const queryPermisos = useQuery({
    queryKey: ["permisos", pagination, searchValue],
    queryFn: () => getAllPermisos(pagination, searchValue),
  });

  const queryPermisosById = useQuery({
    queryKey: ["permisosById", id],
    queryFn: () => (id ? getPermisosById(id) : null),
    enabled: !!id,
  });

  const useInfinitePermisos = useInfiniteQuery({
    queryKey: ["permisos-infinite", searchValue],
    queryFn: ({ pageParam = 0 }) => getAllPermisos({ pageIndex: pageParam, pageSize: 500 }, searchValue || ""),
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
