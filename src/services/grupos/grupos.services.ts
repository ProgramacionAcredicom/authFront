import apiServices from "../configAxios";
import { GruposTypeModel, GruposPaginationType, GruposType } from "@/interfaces/grupos.interfaces";
import { localGruposMapper } from "@/mappers/local-grupos.mapper";

export const getAllGrupos = async (params?: { page?: number; page_size?: number; search?: string }): Promise<GruposPaginationType> => {
  const queryParams: Record<string, any> = {};
  if (params?.page) {
    queryParams.page = params.page;
  }
  if (params?.page_size) {
    queryParams.page_size = params.page_size;
  }
  if (params?.search?.trim().length) {
    queryParams.search = params.search.trim();
  }
  const res = await apiServices.get<GruposPaginationType>("/grupos/", { params: queryParams });
  return res.data;
};

/**
 * Obtiene todos los grupos sin paginación.
 * Hace múltiples llamadas si es necesario para obtener todos los grupos.
 */
export const getAllGruposSinPaginacion = async (): Promise<GruposTypeModel[]> => {
  const allGrupos: GruposTypeModel[] = [];
  let page = 1;
  let hasMore = true;
  const pageSize = 100; // Tamaño grande para minimizar llamadas

  while (hasMore) {
    const res = await getAllGrupos({ page, page_size: pageSize });
    const gruposMapeados = res.results.map((grupo: GruposType) => localGruposMapper(grupo));
    allGrupos.push(...gruposMapeados);
    
    hasMore = page < res.total_pages;
    page++;
  }

  return allGrupos;
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
