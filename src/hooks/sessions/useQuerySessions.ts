import { useQuery } from "@tanstack/react-query";
import { getUserSessions } from "@/services/auth/sessions.services";
import { groupSessionsByAplicativo, SessionsByAplicativo } from "@/interfaces/sessions.interfaces";
import { localSessionsMapper } from "@/mappers/local-sessions.mapper";

export const useQueryUserSessions = (userId: number, enabled: boolean = true) => {
  const queryData = useQuery({
    queryKey: ["sessions", userId],
    queryFn: () => getUserSessions(userId),
    enabled: !!userId && enabled,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });

  const groupedSessions: SessionsByAplicativo = queryData.data
    ? groupSessionsByAplicativo(queryData.data.results)
    : {};

  return {
    ...queryData,
    groupedSessions,
    isLoading: queryData.isLoading,
  };
};

