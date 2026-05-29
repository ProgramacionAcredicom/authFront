import { getAllColaboradores } from "@/services/colaboradores/colaboradores.services";
import { useQuery } from "@tanstack/react-query";

interface UseQueryColaboradoresOptions {
  enabled?: boolean;
}

export const useQueryColaboradores = (
  pagination: { pageIndex: number; pageSize: number } = { pageIndex: 1, pageSize: 15 },
  globalFilter: string = "",
  options?: UseQueryColaboradoresOptions,
) => {
  const queryData = useQuery({
    queryKey: ["colaboradores", pagination, globalFilter],
    queryFn: () => getAllColaboradores(pagination, globalFilter),
    enabled: options?.enabled ?? true,
  });
  return {
    ...queryData,
    isLoading: queryData.isLoading,
  };
};
