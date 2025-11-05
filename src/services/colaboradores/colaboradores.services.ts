import { ColaboradoresModelType, CrearColaboradorType } from "@/interfaces/colaboradores.interfaces";
import { localColaboradorByIdMapper, localColaboradoresMapper } from "@/mappers/local-colaboradores.mapper";
import apiServices from "@/services/configAxios";
import { AxiosRequestConfig } from "axios";

export const getColaboradorById = async (id: string) => {
  const res = await apiServices.get(`/users/actions/${id}`);
  const colaborador = localColaboradorByIdMapper(res.data);
  return colaborador;
};

export const updateColaborador = async (id: number, colaborador: CrearColaboradorType, config: AxiosRequestConfig) => {
  const res = await apiServices.put(`/users/actions/${id}/`, colaborador, config);
  return res.data;
};

export const getAllColaboradores = async (
  pagination: { pageIndex: number; pageSize: number },
  globalFilter: string,
): Promise<ColaboradoresModelType> => {
  const params: Record<string, string | number> = {
    page: pagination.pageIndex,
    page_size: pagination.pageSize,
  };

  if (globalFilter) {
    params.search = globalFilter;
  }

  const res = await apiServices.get("/users/get-list-users/", { params });
  const colaboradores = localColaboradoresMapper(res.data);
  return colaboradores;
};

export const createColaborador = async (colaborador: CrearColaboradorType, config: AxiosRequestConfig) => {
  const res = await apiServices.post("/users/actions/", colaborador, config);
  return res.data;
};
