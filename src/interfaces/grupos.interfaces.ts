export interface GruposType {
  id: number;
  nombre: string;
  aplicativos: Aplicativo[];
}

export interface Aplicativo {
  id: number;
  nombre: string;
}

export interface GruposTypeModel {
  id: number;
  nombre: string;
  permisos: Aplicativo[];
  aplicativos: Aplicativo[];
}

export interface PermisoModel {
  id: number;
  nombre: string;
}
