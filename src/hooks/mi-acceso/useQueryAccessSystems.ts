import { useQuery } from "@tanstack/react-query";

import { CACHE_TIMES, PAGINATION } from "@/config/constants";
import type { GetAccessSystemsParams } from "@/interfaces/mi-acceso.interfaces";
import { getAccessSystems } from "@/services/mi-acceso/mi-acceso.services";

interface UseQueryAccessSystemsOptions {
  enabled?: boolean;
}

export const useQueryAccessSystems = (params?: GetAccessSystemsParams, options?: UseQueryAccessSystemsOptions) => {
  const normalizedParams: GetAccessSystemsParams = {
    is_active: true,
    page: 1,
    page_size: PAGINATION.MAX_PAGE_SIZE,
    ...params,
  };

  return useQuery({
    queryKey: ["mi-acceso-systems", normalizedParams],
    queryFn: () => getAccessSystems(normalizedParams),
    staleTime: CACHE_TIMES.STATIC_DATA,
    gcTime: CACHE_TIMES.STATIC_DATA_GC,
    enabled: options?.enabled ?? true,
  });
};
