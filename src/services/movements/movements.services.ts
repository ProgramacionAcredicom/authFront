import type { CreateMovementPayload, GetMovementsParams, MovementLogApi, MovementReportEmailPayload } from "@/interfaces/movements.interfaces";

import apiServices from "../configAxios";

export const createMovements = async (payload: CreateMovementPayload[]) => {
  const response = await apiServices.post("/users/movements/", payload);
  return response.data;
};

export const getMovements = async (params: GetMovementsParams): Promise<MovementLogApi[]> => {
  const serializedParams = {
    ...params,
    ...(Array.isArray(params.tipo) ? { tipo: params.tipo.join(",") } : {}),
  };
  const response = await apiServices.get<MovementLogApi[]>("/users/movements/", { params: serializedParams });
  return response.data;
};

export const sendMovementReport = async (payload: MovementReportEmailPayload) => {
  const response = await apiServices.post("/users/movements/email-report/", payload);
  return response.data;
};
