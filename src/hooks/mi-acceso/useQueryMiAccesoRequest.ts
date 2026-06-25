import { useQuery } from "@tanstack/react-query";

import { CACHE_TIMES } from "@/config/constants";
import { getMiAccesoRequestById } from "@/services/mi-acceso/mi-acceso.services";

export const useQueryMiAccesoRequest = (id: number | null, enabled = true) => {
  return useQuery({
    queryKey: ["mi-acceso-request", id],
    queryFn: () => {
      if (id == null) {
        throw new Error("Solicitud inválida");
      }

      return getMiAccesoRequestById(id);
    },
    staleTime: CACHE_TIMES.DYNAMIC_DATA,
    gcTime: CACHE_TIMES.DYNAMIC_DATA_GC,
    enabled: enabled && id != null,
  });
};
