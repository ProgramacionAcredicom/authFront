export interface GruposType {
  id: number;
  nombre: string;
  aplicativos: Aplicativo[];
  state: boolean;
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
  state: boolean;
}

export interface PermisoModel {
  id: number;
  nombre: string;
}
