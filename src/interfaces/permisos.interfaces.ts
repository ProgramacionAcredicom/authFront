export interface PermisosType {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Result[];
}

export interface Result {
  id: number;
  permiso: string;
  descripcion: string;
  aplicativo: Aplicativo;
}

export interface Aplicativo {
  id: number;
  nombre: string;
}

export interface PermisosTypeModel {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: ResultModel[];
}

export interface ResultModel {
  id: number;
  nombre: string;
  descripcion: string;
  aplicativo: AplicativoModel;
}

export interface AplicativoModel {
  id: number;
  nombre: string;
}

export interface PermisosCreateType {
  permisos: Permiso[];
}

export interface Permiso {
  nombre: string;
  descripcion: string;
  aplicativo: number;
}

export interface PermisosByIDType {
  id: number;
  nombre: string;
  aplicativos: Aplicativo[];
  permisos: Aplicativo[];
}
