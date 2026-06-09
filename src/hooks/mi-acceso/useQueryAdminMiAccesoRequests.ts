import { useQuery } from "@tanstack/react-query";

import { CACHE_TIMES } from "@/config/constants";
import type { GetAdminMiAccesoRequestsParams } from "@/interfaces/mi-acceso.interfaces";
import { getAdminMiAccesoRequests } from "@/services/mi-acceso/mi-acceso.services";

export const useQueryAdminMiAccesoRequests = (params: GetAdminMiAccesoRequestsParams) => {
  return useQuery({
    queryKey: ["mi-acceso-admin-requests", params],
    queryFn: () => getAdminMiAccesoRequests(params),
    staleTime: CACHE_TIMES.DYNAMIC_DATA,
    gcTime: CACHE_TIMES.DYNAMIC_DATA_GC,
  });
};
