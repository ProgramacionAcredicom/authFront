import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import apiServices from "../configAxios";
import { localAplicativosMapper } from "@/mappers/local-aplicativos.mapper";

export const getAllAplicativos = async (): Promise<AplicativosTypeModel[]> => {
  const res = await apiServices.get("/aplicativos");
  const aplicativos = res.data.map((aplicativo: AplicativosTypeModel) => localAplicativosMapper(aplicativo));
  return aplicativos;
};

export const createAplicativo = async (aplicativo: Omit<AplicativosTypeModel, "id">): Promise<AplicativosTypeModel> => {
  const res = await apiServices.post("/aplicativos/", aplicativo);
  return localAplicativosMapper(res.data);
};

export const getAplicativoById = async (id: string): Promise<AplicativosTypeModel> => {
  const res = await apiServices.get(`/aplicativos/${id}`);
  return localAplicativosMapper(res.data);
};

export const updateAplicativo = async (id: string, aplicativo: Omit<AplicativosTypeModel, "id">): Promise<AplicativosTypeModel> => {
  const res = await apiServices.put(`/aplicativos/${id}/`, aplicativo);
  return localAplicativosMapper(res.data);
};

export const deleteAplicativo = async (id: string): Promise<void> => {
  const res = await apiServices.delete(`/aplicativos/${id}`);
  return res.data;
};
