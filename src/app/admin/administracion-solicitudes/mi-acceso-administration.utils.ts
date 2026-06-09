import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { MI_ACCESO_STATUS_LABELS, MI_ACCESO_TYPE_LABELS } from "@/app/admin/mis-solicitudes/mi-acceso.constants";
import type { AccessRequestDetailApi } from "@/interfaces/mi-acceso.interfaces";

import type { MiAccesoAdminRequestRow, MiAccesoAdminSortableColumnId } from "./mi-acceso-administration.types";

const ADMIN_REQUEST_ORDERING_MAP: Record<MiAccesoAdminSortableColumnId, string> = {
  code: "code",
  type: "request_type",
  status: "status",
  createdAt: "created_at",
};

export function mapAccessRequestDetailToAdminRow(request: AccessRequestDetailApi): MiAccesoAdminRequestRow {
  return {
    id: request.id,
    code: request.code,
    type: request.request_type,
    typeLabel: request.request_type_display || MI_ACCESO_TYPE_LABELS[request.request_type],
    requesterName: request.requester?.name || "Sin solicitante",
    requesterUsername: request.requester?.username || "",
    subjectName: request.subject.name,
    subjectPosition: request.subject.role_name || "Sin puesto",
    detailSummary: request.detail_summary || "Sin detalle adicional",
    additionalDetail: request.additional_detail?.trim() || "",
    status: request.status,
    statusLabel: request.status_display || MI_ACCESO_STATUS_LABELS[request.status],
    createdAt: request.created_at,
    raw: request,
  };
}

export function getAdminRequestsOrdering(
  sorting: Array<{ id: string; desc: boolean }> | null | undefined,
): string | undefined {
  const activeSort = sorting?.[0];

  if (!activeSort) {
    return undefined;
  }

  const backendField = ADMIN_REQUEST_ORDERING_MAP[activeSort.id as MiAccesoAdminSortableColumnId];

  if (!backendField) {
    return undefined;
  }

  return activeSort.desc ? `-${backendField}` : backendField;
}

export function formatAdminRequestDate(value: string) {
  try {
    return format(parseISO(value), "dd MMM yyyy, HH:mm", { locale: es });
  } catch {
    return value;
  }
}
