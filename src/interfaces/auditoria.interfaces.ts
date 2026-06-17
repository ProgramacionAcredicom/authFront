export type AuditAction = "create" | "update" | "delete" | "login" | "logout" | "login_failed";
export type AuditModule = "auth" | "users" | "access" | "system";

export interface AuditLogApi {
  id: number;
  actor?: string | null;
  action: AuditAction;
  module: AuditModule;
  resource_type?: string | null;
  resource_id?: string | null;
  resource_label?: string | null;
  http_method?: string | null;
  path: string;
  status_code?: number | null;
  success?: boolean | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
}

export interface AuditLogListApi {
  count?: number;
  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
  results?: AuditLogApi[];
}

export interface AuditLogRow {
  id: number;
  actor: string;
  action: AuditAction;
  module: AuditModule;
  resourceType: string;
  resourceId: string;
  resourceLabel: string;
  httpMethod: string;
  path: string;
  statusCode: string;
  success: boolean;
  createdAt: string;
  metadataSummary: string;
}

export interface AuditLogFilters {
  fecha_inicio: string;
  fecha_fin: string;
}
