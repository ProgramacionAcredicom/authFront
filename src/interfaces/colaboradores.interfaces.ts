// Tipo de datos para el modelo local
export interface ColaboradoresModelType {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Result[];
}

// Nuevo tipo de datos backend
export interface ColaboradoresType {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Result[];
}

export interface Result {
  id: number;
  dpi: string;
  cif: string;
  name: string;
  username: string;
  user_type: UserType;
  agency: Agency;
  role: Role;
  areas: Areas[];
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  picture: null | string;
  email: string;
}

export interface Agency {
  id: number;
  code: string;
  name: string;
  chif: null;
  state: boolean;
  no_colaboradores: number;
}
export interface Areas {
  id: number;
  code: string;
  name: string;
  chif: null;
  state: boolean;
}

export interface Role {
  id: number;
  role: string;
  state: boolean;
}

export enum UserType {
  Usuario = "USUARIO",
  Kiosco = "KIOSCO",
  Consejo = "CONSEJO",
  ProyectoDialogo = "PROYECTO_DIALOGO",
  Pradera = "PRADERA",
  ProyectoForestal = "PROYECTO_FORESTAL",
  Otro = "OTRO",
}

export interface CrearColaboradorType {
  name: string;
  dpi: string;
  cif: string;
  username: string;
  email: string;
  picture?: null | string | File;
  agency: number;
  role: number;
  grup: number[];
  user_type: UserType;
  password?: string;
  confirm_password?: string;
  executive_number: null | string | number;
  is_active: boolean;
}

export interface ColaboradorIDType {
  id: number;
  dpi: string;
  cif: string;
  ejecutivo_principal: null;
  name: string;
  username: string;
  email: string;
  picture: null;
  user_type: string;
  agency: Agency;
  role: Role;
  area: null;
  grupos: Grupo[];
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  otp_enabled: boolean;
}

export interface Agency {
  id: number;
  name: string;
  code: string;
  state: boolean;
}

export interface Grupo {
  id: number;
  nombre: string;
  permisos: Permiso[];
}

export interface Permiso {
  id: number;
  nombre: string;
}
