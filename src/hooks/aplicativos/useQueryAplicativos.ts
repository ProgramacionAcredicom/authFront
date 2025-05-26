import { getAllAplicativos, getAplicativoById } from "@/services/aplicativos/aplicativos.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryAplicaivos = () => {
  const queryAplicativos = useQuery({
    queryKey: ["aplicativos"],
    queryFn: getAllAplicativos,
  });

  return {
    queryAplicativos,
  };
};

export const useQueryAplicativoById = (id: string) => {
  const queryAplicativoById = useQuery({
    queryKey: ["aplicativo", id],
    queryFn: () => getAplicativoById(id),
  });

  return {
    queryAplicativoById,
  };
};
