export interface UsuarioType {
  id: number;
  dpi: string;
  cif: string;
  ejecutivo_principal: null;
  name: string;
  username: string;
  email: string;
  picture: string;
  user_type: UserType;
  agency: Agency;
  role: Role;
  area: Agency;
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
  state?: boolean;
  chif?: Chif;
}

export interface Chif {
  id: number;
  name: string;
  email: string;
  picture: null;
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

export interface Role {
  id: number;
  role: string;
  state: boolean;
}

export enum UserType {
  USUARIO = "Usuario",
  KIOSCO = "Kiosco",
  CONSEJO = "Consejo",
  PROYECTO_DIALOGO = "Proyecto Dialogo",
  PRADERA = "Pradera",
  PROYECTO_FORESTAL = "Proyecto Forestal",
  OTRO = "Otro",
}
