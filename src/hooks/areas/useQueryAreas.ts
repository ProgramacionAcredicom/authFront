import { useQuery } from "@tanstack/react-query";
import { listAreas } from "@/services/areas/areas.services";

export const useQueryListAreas = () => {
  const queryAreas = useQuery({
    queryKey: ["areas"],
    queryFn: listAreas,
  });
  return { queryAreas };
};
