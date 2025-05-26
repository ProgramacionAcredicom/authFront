import { getAllAgencias } from "@/services/agencias/agencias.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryAgencias = () => {
  const queryAgencias = useQuery({
    queryKey: ["agencias"],
    queryFn: getAllAgencias,
  });
  return { queryAgencias };
};
