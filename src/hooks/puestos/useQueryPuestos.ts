import { useQuery } from "@tanstack/react-query";

import { getAllPuestos, getPuestoById } from "@/services/puestos/puestos.services";

interface UseQueryPuestosOptions {
  enabled?: boolean;
}

export const useQueryPuestos = (id?: string | number, options?: UseQueryPuestosOptions) => {
  const queryPuestos = useQuery({
    queryKey: ["puestos"],
    queryFn: getAllPuestos,
    enabled: options?.enabled ?? true,
  });

  const queryPuestoById = useQuery({
    queryKey: ["puesto", id],
    queryFn: () => getPuestoById(String(id)),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });

  return {
    queryPuestos,
    queryPuestoById,
  };
};
