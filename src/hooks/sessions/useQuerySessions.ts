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

