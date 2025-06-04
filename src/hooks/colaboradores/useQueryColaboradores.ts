import { getAllColaboradores } from "@/services/colaboradores/colaboradores.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryColaboradores = (
  pagination: { pageIndex: number; pageSize: number } = { pageIndex: 1, pageSize: 15 },
  globalFilter: string = "",
) => {
  const queryData = useQuery({
    queryKey: ["colaboradores", pagination, globalFilter],
    queryFn: () => getAllColaboradores(pagination, globalFilter),
  });
  return {
    ...queryData,
    isLoading: queryData.isLoading,
  };
};
