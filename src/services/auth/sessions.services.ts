import { SessionResponse, CloseSessionsRequest, CloseSessionsResponse, Session } from "@/interfaces/sessions.interfaces";
import apiServices from "@/services/configAxios";

export const getUserSessions = async (
  userId: number,
  options?: { pageSize?: number; ordering?: string }
): Promise<SessionResponse> => {
  // Validar userId
  if (!userId || userId <= 0 || !Number.isInteger(userId)) {
    throw new Error("Invalid user ID: userId must be a positive integer");
  }

  const params: Record<string, string | number> = {
    user_id: userId,
    ordering: options?.ordering || "expires_at",
    page_size: options?.pageSize || 10,
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
    total: res.data.total, // Mantener total original del servidor
    total_active: filteredSessions.length, // Añadir total de sesiones activas
  };
};

export const closeSessions = async (sessionIds: number[]): Promise<CloseSessionsResponse> => {
  // Validar que sessionIds no esté vacío
  if (!sessionIds || sessionIds.length === 0) {
    throw new Error("No session IDs provided");
  }

  // Validar que todos los IDs sean números enteros positivos
  if (!sessionIds.every(id => Number.isInteger(id) && id > 0)) {
    throw new Error("Invalid session IDs: all IDs must be positive integers");
  }

  const body: CloseSessionsRequest = {
    sessions: sessionIds,
  };

  // Usar el endpoint RESTful para usuarios autenticados que permite cerrar solo sus propias sesiones
  const res = await apiServices.patch<CloseSessionsResponse>("/user/sessions/", body);
  
  // Validar formato de respuesta del servidor
  if (!res.data || !res.data.message) {
    throw new Error("Invalid response format from server");
  }
  
  return res.data;
};

/**
 * Obtiene las sesiones activas del usuario autenticado
 * @returns Lista de sesiones activas del usuario
 */
export const getActiveSessions = async (): Promise<{ results: Session[]; count: number }> => {
  const res = await apiServices.get<{ results: Session[]; count: number }>("/user/sessions/");
  return res.data;
};

