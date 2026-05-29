import { useQuery } from "@tanstack/react-query";

import type { GetMovementsParams } from "@/interfaces/movements.interfaces";
import { CACHE_TIMES } from "@/config/constants";
import { getMovements } from "@/services/movements/movements.services";

export const useQueryMovements = (params: GetMovementsParams) => {
  return useQuery({
    queryKey: ["movements-report", params],
    queryFn: () => getMovements(params),
    staleTime: CACHE_TIMES.DYNAMIC_DATA,
    gcTime: CACHE_TIMES.DYNAMIC_DATA_GC,
  });
};
