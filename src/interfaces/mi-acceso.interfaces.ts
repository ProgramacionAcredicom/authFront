import type { MiAccesoRequestStatus, MiAccesoRequestType } from "@/app/admin/mis-solicitudes/mi-acceso.types";

export interface UserBriefApi {
  id: number;
  name: string;
  username: string;
  email: string;
  cif: string | null;
  executive_number: string | null;
  employee_id: string;
  role_name: string;
  agency_name: string;
  area_name: string;
}

export interface AccessSystemApi {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  system_kind: "form" | "pdf_row";
  created_at: string;
  updated_at: string;
}

export interface AccessRequestSystemLineApi {
  id: number;
  system: AccessSystemApi;
  system_id: number;
  reference_user: UserBriefApi | null;
  reference_user_id: number | null;
  access_observation: string | null;
  sort_order: number;
  created_at: string;
}

export interface AccessRequestStatusHistoryApi {
  id: number;
  previous_status: MiAccesoRequestStatus | null;
  new_status: MiAccesoRequestStatus;
  comment: string | null;
  changed_by: UserBriefApi | null;
  changed_at: string;
}

export interface AccessRequestDetailApi {
  id: number;
  code: string;
  request_type: MiAccesoRequestType;
  request_type_display: string;
  status: MiAccesoRequestStatus;
  status_display: string;
  requester: UserBriefApi | null;
  subject: UserBriefApi;
  detail_summary: string;
  created_at: string;
  updated_at: string;
  boss: UserBriefApi | null;
  absence_type: "bloqueo_vacaciones" | "suspension" | null;
  start_date: string | null;
  end_date: string | null;
  reason: string | null;
  additional_detail: string | null;
  status_changed_by: UserBriefApi | null;
  status_changed_at: string | null;
  system_lines?: AccessRequestSystemLineApi[];
  status_history?: AccessRequestStatusHistoryApi[];
  pdf_download_url?: string | null;
}

export interface AccessSystemListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AccessSystemApi[];
}

export interface AccessRequestListResponse {
  count?: number;
  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
  next?: string | null;
  previous?: string | null;
  summary?: Record<string, number>;
  results: AccessRequestDetailApi[];
}

export interface GetMiAccesoRequestsParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: MiAccesoRequestStatus;
  request_type?: MiAccesoRequestType;
  ordering?: string;
}

export interface GetAdminMiAccesoRequestsParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: MiAccesoRequestStatus;
  request_type?: MiAccesoRequestType;
  ordering?: string;
}

export interface GetAccessSystemsParams {
  is_active?: boolean;
  system_kind?: "form" | "pdf_row";
  code?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CreateAccessRequestSystemPayload {
  system_id: number;
  reference_user_id: number | null;
  access_observation: string;
  sort_order: number;
}

export interface CreateAccessRequestPayload {
  request_type: MiAccesoRequestType;
  subject_user_id?: number;
  boss_user_id?: number;
  additional_detail: string;
  absence_type?: "bloqueo_vacaciones" | "suspension";
  start_date?: string;
  end_date?: string;
  reason?: string;
  systems: CreateAccessRequestSystemPayload[];
}

export type UpdateAccessRequestStatus = Extract<MiAccesoRequestStatus, "en_proceso" | "aprobado" | "rechazado">;

export interface UpdateAccessRequestStatusPayload {
  status: UpdateAccessRequestStatus;
  comment?: string;
}
