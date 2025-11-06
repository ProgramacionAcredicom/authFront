export interface SessionResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Session[];
}

export interface Session {
  id: number;
  custom_session_id: string;
  user: SessionUser;
  aplicativo: SessionAplicativo;
  ip_address: string;
  device_info: string;
  created_at: string;
  expires_at: string;
}

export interface SessionUser {
  id: number;
  name: string;
  username: string;
}

export interface SessionAplicativo {
  id: number;
  nombre: string;
}

export interface CloseSessionsRequest {
  sessions: number[];
}

export interface CloseSessionsResponse {
  message: string;
}

export type SessionsByAplicativo = Record<number, Session[]>;

export function groupSessionsByAplicativo(sessions: Session[]): SessionsByAplicativo {
  return sessions.reduce((acc, session) => {
    const aplicativoId = session.aplicativo.id;
    if (!acc[aplicativoId]) {
      acc[aplicativoId] = [];
    }
    acc[aplicativoId].push(session);
    return acc;
  }, {} as SessionsByAplicativo);
}

