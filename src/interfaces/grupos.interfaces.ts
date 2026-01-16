export interface GruposType {
  id: number;
  nombre: string;
  aplicativos: Aplicativo[];
  users?: UserInGroup[];
  users_count?: number;
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
  is_staff?: boolean; // Opcional en listado de grupos (GET /grupos/)
  is_superuser?: boolean; // Opcional en listado de grupos (GET /grupos/)
  picture: string | null;
  agency?: {
    // Opcional en listado de grupos (GET /grupos/), siempre presente en GET /grupos/{id}/
    id: number;
    name: string;
  };
  role: {
    id: number;
    role: string;
  } | null;
}

export interface GruposTypeModel {
  id: number;
  nombre: string;
  permisos: Aplicativo[];
  aplicativos: Aplicativo[];
  users?: UserInGroup[];
  users_count?: number;
  state: boolean;
  created_on?: string;
  update_at?: string;
}

export interface PermisoModel {
  id: number;
  nombre: string;
}

export interface GruposPaginationType {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: GruposType[];
}
