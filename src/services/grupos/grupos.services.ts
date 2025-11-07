import apiServices from "../configAxios";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { localGruposMapper } from "@/mappers/local-grupos.mapper";

export const getAllGrupos = async () => {
  const res = await apiServices.get("/grupos/");
  const grupos = res.data.map((grupo: GruposTypeModel) => localGruposMapper(grupo));
  return grupos;
};

interface CreateGrupoDTO {
  nombre: string;
  permisos: number[];
  users_ids?: number[];
}

export const createGrupo = async (data: CreateGrupoDTO) => {
  const res = await apiServices.post("/grupos/", data);
  return res.data;
};

export const getGrupoById = async (id: string) => {
  const res = await apiServices.get(`/grupos/${id}/`);
  return res.data;
};

export const updateGrupo = async (id: string, data: CreateGrupoDTO) => {
  const res = await apiServices.put(`/grupos/${id}/`, data);
  return res.data;
};

export const deleteGrupo = async (id: string) => {
  const res = await apiServices.delete(`/grupos/${id}/`);
  return res.data;
};
