import { PermisosCreateType, PermisosTypeModel, Result, PermisosByIDType, AplicativoModel } from "@/interfaces/permisos.interfaces";
import apiServices from "@/services/configAxios";
import { localPermisosMapper, localPermisosByIdMapper } from "@/mappers/local-permisos.mapper";

export const getAllPermisos = async (pagination: { pageIndex: number; pageSize: number }, globalFilter?: string): Promise<PermisosTypeModel> => {
  const params: Record<string, string | number> = globalFilter
    ? { search: globalFilter }
    : {
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
      };
  const res = await apiServices.get("/permisos/", { params });
  const permisos = localPermisosMapper(res.data);
  return permisos;
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
