import { AgenciasModel } from "@/models/agencias.model";
import { AgenciasCreateType, AgenciasModelTypes, AgenciasTypes } from "@/interfaces/agencias.interfaces";
import apiServices from "@/services/configAxios";
import { localAgenciasMapper } from "@/mappers/local-agencias.mapper";
import { AgenciasSchema } from "@/schemas/agencias/agencias.schemas";

export const getAllAgencias = async (): Promise<AgenciasModelTypes[]> => {
  const res = await apiServices.get("/agency");
  const agencias: AgenciasModel[] = res.data.map((agencia: AgenciasTypes) => localAgenciasMapper(agencia));
  return agencias;
};

export const createAgencia = async (data: AgenciasSchema): Promise<AgenciasCreateType> => {
  const res = await apiServices.post<AgenciasCreateType>("/agency/", data);
  return res.data;
};

export const updateAgencia = async (id: number, data: Omit<AgenciasModelTypes, "no_colaboradores">): Promise<AgenciasModelTypes> => {
  const res = await apiServices.put<AgenciasModelTypes>(`/agency/actions/${id}/`, data);
  return res.data;
};
