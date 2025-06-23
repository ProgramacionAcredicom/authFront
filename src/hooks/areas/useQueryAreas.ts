import { useQuery } from "@tanstack/react-query";
import { listAreas, listAreasSinPaginacion } from "@/services/areas/areas.services";

export const useQueryListAreas = () => {
  const queryAreas = useQuery({
    queryKey: ["areas"],
    queryFn: listAreas,
  });
  return { queryAreas };
};

export const useQueryListAreasSinPaginacion = () => {
  const queryAreasSinPaginacion = useQuery({
    queryKey: ["areas-sinPaginacion"],
    queryFn: listAreasSinPaginacion,
  });
  return { queryAreasSinPaginacion };
};
