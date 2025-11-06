import { SessionResponse, Session, SessionsByAplicativo, groupSessionsByAplicativo } from "@/interfaces/sessions.interfaces";

export const localSessionsMapper = (data: SessionResponse): SessionResponse => {
  return {
    ...data,
    results: data.results.map((session) => ({
      ...session,
      // Aquí se pueden hacer transformaciones adicionales si es necesario
    })),
  };
};

export { groupSessionsByAplicativo };

