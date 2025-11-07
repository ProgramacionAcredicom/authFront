export interface GruposType {
  id: number;
  nombre: string;
  aplicativos: Aplicativo[];
  users?: UserInGroup[];
  state: boolean;
  created_on?: string;
  update_at?: string;
}

export interface Aplicativo {
  id: number;
  nombre: string;
}

export interface UserInGroup {
  id: number;
  name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  picture: string | null;
  agency: {
    id: number;
    name: string;
  };
  role: {
    id: number;
    role: string;
  };
}

export interface GruposTypeModel {
  id: number;
  nombre: string;
  permisos: Aplicativo[];
  aplicativos: Aplicativo[];
  users?: UserInGroup[];
  state: boolean;
  created_on?: string;
  update_at?: string;
}

export interface PermisoModel {
  id: number;
  nombre: string;
}
