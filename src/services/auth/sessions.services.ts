import { SessionResponse, CloseSessionsRequest, CloseSessionsResponse } from "@/interfaces/sessions.interfaces";
import apiServices from "@/services/configAxios";

export const getUserSessions = async (userId: number): Promise<SessionResponse> => {
  const params: Record<string, string | number> = {
    user_id: userId,
    ordering: "expires_at",
    page_size: 10,
  };

  const res = await apiServices.get<SessionResponse>("/auth/sessions/", { params });
  
  // Filtrar solo las sesiones activas (expires_at > now)
  const now = new Date();
  const filteredSessions = res.data.results.filter((session) => {
    const expiresAt = new Date(session.expires_at);
    return expiresAt > now;
  });

  return {
    ...res.data,
    results: filteredSessions,
    total: filteredSessions.length,
  };
};

export const closeSessions = async (sessionIds: number[]): Promise<CloseSessionsResponse> => {
  const body: CloseSessionsRequest = {
    sessions: sessionIds,
  };

  const res = await apiServices.patch<CloseSessionsResponse>("/auth/sessions/", body);
  return res.data;
};

