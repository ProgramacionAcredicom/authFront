import { getAllGrupos } from "@/services/grupos/grupos.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryGrupos = () => {
  const queryGrupos = useQuery({
    queryKey: ["grupos"],
    queryFn: getAllGrupos,
  });
  return {
    queryGrupos,
  };
};
