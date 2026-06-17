import apiServices from "@/services/configAxios";
import {
  PuestoDetail,
  PuestoDetailResponse,
  PuestoListItem,
  PuestoListResponse,
  PuestoWritePayload,
} from "@/interfaces/puestos.interfaces";
import { localPuestoDetailMapper, localPuestoListMapper } from "@/mappers/local-puestos.mapper";

export const getAllPuestos = async (): Promise<PuestoListItem[]> => {
  const res = await apiServices.get<PuestoListResponse[]>("/roles/");
  return res.data.map(localPuestoListMapper);
};

export const getPuestoById = async (id: string): Promise<PuestoDetail> => {
  const res = await apiServices.get<PuestoDetailResponse>(`/roles/actions/${id}/`);
  return localPuestoDetailMapper(res.data);
};

export const createPuesto = async (payload: PuestoWritePayload): Promise<PuestoDetail> => {
  const res = await apiServices.post<PuestoDetailResponse>("/roles/", payload);
  return localPuestoDetailMapper(res.data);
};

export const updatePuesto = async (id: string, payload: PuestoWritePayload): Promise<PuestoDetail> => {
  const res = await apiServices.put<PuestoDetailResponse>(`/roles/actions/${id}/`, payload);
  return localPuestoDetailMapper(res.data);
};

export const deletePuesto = async (id: string): Promise<PuestoDetail> => {
  const res = await apiServices.delete<PuestoDetailResponse>(`/roles/actions/${id}/`);
  return localPuestoDetailMapper(res.data);
};
