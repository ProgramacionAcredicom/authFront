import { useQuery } from "@tanstack/react-query";

import { CACHE_TIMES } from "@/config/constants";
import type { GetMiAccesoRequestsParams } from "@/interfaces/mi-acceso.interfaces";
import { getMiAccesoRequests } from "@/services/mi-acceso/mi-acceso.services";

interface UseQueryMiAccesoRequestsOptions {
  enabled?: boolean;
}

export const useQueryMiAccesoRequests = (params: GetMiAccesoRequestsParams, options?: UseQueryMiAccesoRequestsOptions) => {
  return useQuery({
    queryKey: ["mi-acceso-requests", params],
    queryFn: () => getMiAccesoRequests(params),
    staleTime: CACHE_TIMES.DYNAMIC_DATA,
    gcTime: CACHE_TIMES.DYNAMIC_DATA_GC,
    enabled: options?.enabled ?? true,
  });
};
