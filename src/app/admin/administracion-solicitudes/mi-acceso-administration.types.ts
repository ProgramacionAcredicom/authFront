import type { MiAccesoRequestStatus, MiAccesoRequestType } from "@/app/admin/mis-solicitudes/mi-acceso.types";
import type { AccessRequestDetailApi } from "@/interfaces/mi-acceso.interfaces";

export interface MiAccesoAdminRequestRow {
  id: number;
  code: string;
  type: MiAccesoRequestType;
  typeLabel: string;
  requesterName: string;
  requesterUsername: string;
  subjectName: string;
  subjectPosition: string;
  detailSummary: string;
  additionalDetail: string;
  status: MiAccesoRequestStatus;
  statusLabel: string;
  createdAt: string;
  raw: AccessRequestDetailApi;
}

export type MiAccesoAdminSortableColumnId = "code" | "type" | "status" | "createdAt";
