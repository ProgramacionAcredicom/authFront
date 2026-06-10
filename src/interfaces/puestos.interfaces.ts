export interface PuestoListResponse {
  id: number;
  role: string;
  state: boolean;
  grupos_count?: number | string | null;
  created_on?: string | null;
  update_at?: string | null;
}

export interface PuestoGroupReferenceResponse {
  id: number;
  nombre: string;
  state: boolean;
}

export interface PuestoDetailResponse {
  id: number;
  role: string;
  state: boolean;
  grupos?: PuestoGroupReferenceResponse[];
  created_on?: string | null;
  update_at?: string | null;
}

export interface PuestoListItem {
  id: number;
  role: string;
  state: boolean;
  gruposCount: number;
  created_on?: string;
  update_at?: string;
}

export interface PuestoDetail {
  id: number;
  role: string;
  state: boolean;
  grupos: number[];
  created_on?: string;
  update_at?: string;
}

export interface PuestoWritePayload {
  role: string;
  state: boolean;
  grupos: number[];
}
