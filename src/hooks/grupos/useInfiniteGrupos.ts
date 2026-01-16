import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllGrupos } from "@/services/grupos/grupos.services";
import { CACHE_TIMES } from "@/config/constants";

export type FilterOption = "all" | "active" | "inactive";
export type SortOption = "nombre-asc" | "nombre-desc" | "created_on-asc" | "created_on-desc";

/**
 * Convierte el filtro del frontend al formato del backend
 */
const getStateFilter = (filterBy: FilterOption): boolean | undefined => {
  if (filterBy === "active") return true;
  if (filterBy === "inactive") return false;
  return undefined; // "all" no envía filtro
};

/**
 * Convierte el ordenamiento del frontend al formato del backend (Django REST framework)
 * Nota: El backend tiene ordering_fields = ['id', 'nombre', 'created_on', 'update_at', 'state']
 */
const getOrdering = (sortBy: SortOption): string | undefined => {
  switch (sortBy) {
    case "nombre-asc":
      return "nombre";
    case "nombre-desc":
      return "-nombre";
    case "created_on-asc":
      return "created_on";
    case "created_on-desc":
      return "-created_on";
    default:
      return undefined;
  }
};

/**
 * Query infinita para obtener grupos con scroll infinito
 * staleTime: 5 minutos (datos relativamente estáticos)
 */
export const useInfiniteGrupos = (
  search?: string,
  filterBy?: FilterOption,
  sortBy?: SortOption
) => {
  const searchFilter = search || "";
  const stateFilter = filterBy ? getStateFilter(filterBy) : undefined;
  const ordering = sortBy ? getOrdering(sortBy) : undefined;
  
  return useInfiniteQuery({
    queryKey: ["grupos-infinite", searchFilter, filterBy, sortBy],
    queryFn: ({ pageParam = 1 }) => getAllGrupos({ 
      page: pageParam as number, 
      page_size: 12,
      search: searchFilter || undefined,
      state: stateFilter,
      ordering: ordering,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Usar total_pages y page de la respuesta para determinar si hay más páginas
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      // Si estamos en la última página, no hay más páginas
      return undefined;
    },
    staleTime: CACHE_TIMES.SEMI_STATIC_DATA,
    gcTime: CACHE_TIMES.SEMI_STATIC_DATA_GC,
  });
};

