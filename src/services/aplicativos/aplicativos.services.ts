import { AplicativosTypeModel, AppKeyInfoResponse, GenerateAppKeyResponse } from "@/interfaces/aplicativos.interfaces";
import apiServices from "../configAxios";
import { localAplicativosMapper } from "@/mappers/local-aplicativos.mapper";
import { logger } from "@/lib/logger";

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

export const deleteAplicativo = async (id: string): Promise<{ message: string }> => {
  const res = await apiServices.delete(`/aplicativos/${id}`);
  return res.data;
};

export const getAppKeyInfo = async (id: string): Promise<AppKeyInfoResponse> => {
  try {
    const res = await apiServices.get(`/aplicativos/${id}/app-key/`);
    logger.debug("Respuesta de getAppKeyInfo", { aplicativoId: id, data: res.data });
    return res.data;
  } catch (error) {
    logger.errorWithContext("Error al obtener información de App Key", error, {
      aplicativoId: id,
      responseData: error instanceof Error && "response" in error ? (error as { response?: { data?: unknown; status?: number } }).response?.data : undefined,
      status: error instanceof Error && "response" in error ? (error as { response?: { status?: number } }).response?.status : undefined,
    });
    // Si es un error 404, podría ser que el aplicativo no existe
    // Si es otro error, lo propagamos
    throw error;
  }
};

export const generateAppKey = async (id: string): Promise<GenerateAppKeyResponse> => {
  const res = await apiServices.post(`/aplicativos/${id}/generate-app-key/`, {});
  return res.data;
};
