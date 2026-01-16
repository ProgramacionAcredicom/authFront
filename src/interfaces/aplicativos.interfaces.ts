export interface AplicativosType {
  id: number;
  nombre: string;
  descripcion: string;
  configuracion: object | null;
  state: boolean;
}
export interface AplicativosTypeModel {
  id: number;
  nombre: string;
  descripcion: string;
  configuracion: object | null;
  state: boolean;
}

export interface AppKeyInfoResponse {
  aplicativo_id: number;
  aplicativo_nombre: string;
  app_key_created_at: string;
  app_key_last_chars: string;
  has_app_key: boolean;
}

export interface GenerateAppKeyResponse {
  message: string;
  app_key: string;
  warning: string;
  aplicativo_id: number;
  aplicativo_nombre: string;
  created_at: string;
}
