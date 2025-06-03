import { getAllGrupos, getGrupoById } from "@/services/grupos/grupos.services";
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

export const useQueryGruposById = (id: string) => {
  const queryGruposById = useQuery({
    queryKey: ["grupos", id],
    queryFn: () => getGrupoById(id),
  });
  return {
    queryGruposById,
  };
};
