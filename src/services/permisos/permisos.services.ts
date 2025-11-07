import { PermisosCreateType, ResultModel, PermisosByIDType, AplicativoModel } from "@/interfaces/permisos.interfaces";
import apiServices from "@/services/configAxios";
import { localPermisosMapper, localPermisosByIdMapper } from "@/mappers/local-permisos.mapper";
import { PermisosModel } from "@/models/permisos.model";

export const getAllPermisos = async (
  { pageIndex, pageSize }: { pageIndex: number; pageSize: number },
  globalFilter?: string,
): Promise<PermisosModel> => {
  const params: Record<string, any> = {
    page: pageIndex + 1,
    page_size: pageSize,
  };
  if (globalFilter?.trim().length) {
    params.search = globalFilter.trim();
  }
  const res = await apiServices.get("/permisos/", { params });
  return localPermisosMapper(res.data);
};

export interface PermisosByIdResponse {
  aplicativo: string;
  permiso: string;
  arrayPermisos: AplicativoModel[];
}

export const getPermisosById = async (id: string): Promise<PermisosByIdResponse[]> => {
  const res = await apiServices.get<PermisosByIDType>(`/grupo/permisos/${id}`);
  const permisos = localPermisosByIdMapper(res.data);
  return permisos.toRows();
};

export const getPermisoById = async (id: string): Promise<ResultModel> => {
  const res = await apiServices.get<ResultModel>(`/permisos/${id}/`);
  return res.data;
};

export const createPermiso = async (permiso: PermisosCreateType): Promise<ResultModel> => {
  const res = await apiServices.post<ResultModel>("/permisos/", permiso);
  return res.data;
};

export const updatePermiso = async (
  permiso: { nombre: string; descripcion: string },
  id: string
): Promise<ResultModel> => {
  const res = await apiServices.put<ResultModel>(`/permisos/${id}/`, permiso);
  return res.data;
};

export const deletePermiso = async (id: string): Promise<{ message: string }> => {
  const res = await apiServices.delete<{ message: string }>(`/permisos/${id}/`);
  return res.data;
};
