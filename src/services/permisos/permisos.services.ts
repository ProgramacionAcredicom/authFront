import { PermisosCreateType, Result, PermisosByIDType, AplicativoModel } from "@/interfaces/permisos.interfaces";
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

export const getPermisoById = async (id: string): Promise<PermisosByIdResponse> => {
  const res = await apiServices.get<PermisosByIDType>(`/permisos/${id}`);
  const permisos = res.data;
  return permisos;
};

export const createPermiso = async (permiso: PermisosCreateType): Promise<Result> => {
  const res = await apiServices.post<Result>("/permisos/", permiso);
  return res.data;
};

export const updatePermiso = async (permiso, id: string): Promise<Result> => {
  const res = await apiServices.put<Result>(`/permisos/${id}/`, permiso);
  return res.data;
};

export const deletePermiso = async (id: string): Promise<{ message: string }> => {
  const res = await apiServices.delete<{ message: string }>(`/permisos/${id}/`);
  return res.data;
};
