import { AreasPaginationType, Result } from "@/interfaces/areas.interfaces";
import apiServices from "../configAxios";
import { AreasSchema } from "@/schemas/areas/areas.schemas";

export const listAreas = async (): Promise<AreasPaginationType> => {
  const res = await apiServices.get<AreasPaginationType>("/areas/");
  return res.data;
};

export const listAreasSinPaginacion = async (): Promise<AreasPaginationType | Result[]> => {
  const res = await apiServices.get<AreasPaginationType | Result[]>("/areas/sin-paginacion/");
  return res.data;
};

export const crearArea = async (data: AreasSchema) => {
  const res = await apiServices.post("/areas/", data);
  return res.data;
};

export const actualizarAreas = async (id: number, data: AreasSchema) => {
  const res = await apiServices.put(`/areas/${id}/`, data);
  return res.data;
};

export const eliminarAreas = async (id: number) => {
  const res = await apiServices.delete(`/areas/${id}`);
  return res.data;
};
