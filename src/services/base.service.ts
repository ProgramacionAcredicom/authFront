import apiServices from "./configAxios";
import { AxiosRequestConfig } from "axios";

/**
 * Clase base para servicios API
 * Proporciona métodos comunes para operaciones CRUD
 */
export abstract class BaseService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * Obtener todos los recursos con paginación opcional
   */
  async getAll(params?: Record<string, unknown>): Promise<T[]> {
    const response = await apiServices.get<T[]>(this.basePath, { params });
    return response.data;
  }

  /**
   * Obtener un recurso por ID
   */
  async getById(id: string | number): Promise<T> {
    const response = await apiServices.get<T>(`${this.basePath}/${id}/`);
    return response.data;
  }

  /**
   * Crear un nuevo recurso
   */
  async create(data: TCreate, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiServices.post<T>(this.basePath, data, config);
    return response.data;
  }

  /**
   * Actualizar un recurso existente
   */
  async update(id: string | number, data: TUpdate, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiServices.put<T>(`${this.basePath}/${id}/`, data, config);
    return response.data;
  }

  /**
   * Eliminar un recurso
   */
  async delete(id: string | number): Promise<void> {
    await apiServices.delete(`${this.basePath}/${id}/`);
  }

  /**
   * Método personalizado para requests GET
   */
  protected async get<R = T>(endpoint: string, config?: AxiosRequestConfig): Promise<R> {
    const response = await apiServices.get<R>(`${this.basePath}${endpoint}`, config);
    return response.data;
  }

  /**
   * Método personalizado para requests POST
   */
  protected async post<R = T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<R> {
    const response = await apiServices.post<R>(`${this.basePath}${endpoint}`, data, config);
    return response.data;
  }

  /**
   * Método personalizado para requests PUT
   */
  protected async put<R = T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<R> {
    const response = await apiServices.put<R>(`${this.basePath}${endpoint}`, data, config);
    return response.data;
  }

  /**
   * Método personalizado para requests PATCH
   */
  protected async patch<R = T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<R> {
    const response = await apiServices.patch<R>(`${this.basePath}${endpoint}`, data, config);
    return response.data;
  }

  /**
   * Método personalizado para requests DELETE
   */
  protected async deleteRequest<R = void>(endpoint: string, config?: AxiosRequestConfig): Promise<R> {
    const response = await apiServices.delete<R>(`${this.basePath}${endpoint}`, config);
    return response.data;
  }
}

/**
 * Factory para crear servicios con paginación
 */
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: T[];
}

export abstract class PaginatedService<T, TCreate = Partial<T>, TUpdate = Partial<T>> extends BaseService<T, TCreate, TUpdate> {
  /**
   * Obtener recursos paginados
   */
  async getPaginated(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    [key: string]: unknown;
  }): Promise<PaginatedResponse<T>> {
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
    // Agregar otros parámetros
    Object.keys(params || {}).forEach((key) => {
      if (!["page", "page_size", "search"].includes(key) && params?.[key] !== undefined) {
        queryParams[key] = params[key];
      }
    });

    const response = await apiServices.get<PaginatedResponse<T>>(this.basePath, { params: queryParams });
    return response.data;
  }

  /**
   * Obtener todos los recursos sin paginación (hace múltiples llamadas si es necesario)
   */
  async getAllWithoutPagination(pageSize = 100): Promise<T[]> {
    const allItems: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await this.getPaginated({ page, page_size: pageSize });
      allItems.push(...res.results);
      hasMore = page < res.total_pages;
      page++;
    }

    return allItems;
  }
}
