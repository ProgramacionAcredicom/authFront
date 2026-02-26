import apiServices from "../configAxios";
import { GruposTypeModel, GruposPaginationType, GruposType } from "@/interfaces/grupos.interfaces";
import { localGruposMapper } from "@/mappers/local-grupos.mapper";
import { PAGINATION } from "@/config/constants";

export const getAllGrupos = async (params?: { 
  page?: number; 
  page_size?: number; 
  search?: string;
  usuario?: string;
  grupo?: string;
  aplicativo?: string;
  ordering?: string;
  state?: boolean;
}): Promise<GruposPaginationType> => {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) {
    queryParams.page = params.page;
  }
  if (params?.page_size) {
    queryParams.page_size = params.page_size;
  }
  if (params?.search?.trim().length) {
    queryParams.search = params.search.trim();
  }
  if (params?.usuario?.trim().length) {
    queryParams.usuario = params.usuario.trim();
  }
  if (params?.grupo?.trim().length) {
    queryParams.grupo = params.grupo.trim();
  }
  if (params?.aplicativo?.trim().length) {
    queryParams.aplicativo = params.aplicativo.trim();
  }
  if (params?.ordering?.trim().length) {
    queryParams.ordering = params.ordering.trim();
  }
  if (params?.state !== undefined) {
    queryParams.state = params.state;
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
  const pageSize = PAGINATION.LARGE_PAGE_SIZE;
  let totalPages: number | null = null;

  while (true) {
    try {
      const res = await getAllGrupos({ page, page_size: pageSize });
      const gruposMapeados = res.results.map((grupo: GruposType) => localGruposMapper(grupo));
      allGrupos.push(...gruposMapeados);
      
      // Si no hay resultados en esta página, salir
      if (res.results.length === 0) {
        break;
      }
      
      // Calcular el total de páginas desde count en la primera respuesta
      if (totalPages === null && res.count !== undefined) {
        totalPages = Math.ceil(res.count / pageSize);
      }
      
      // Verificar múltiples condiciones para determinar si hay más páginas
      // 1. Si next es null, no hay más páginas
      // 2. Si totalPages está calculado y page >= totalPages, no hay más páginas
      const hasMorePages = res.next !== null && (totalPages === null || page < totalPages);
      
      if (!hasMorePages) {
        break;
      }
      
      page++;
    } catch (error: unknown) {
      const apiError = error as { response?: { status?: number } };
      // Si recibimos un 404 u otro error, significa que no hay más páginas
      // Salir del bucle y devolver los grupos obtenidos hasta ahora
      if (apiError.response?.status === 404 || apiError.response?.status === 400) {
        break;
      }
      // Si es otro error, relanzarlo
      throw error;
    }
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
