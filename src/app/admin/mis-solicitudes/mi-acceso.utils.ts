import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";
import type { AccessRequestDetailApi, UserBriefApi } from "@/interfaces/mi-acceso.interfaces";
import { generateTempId } from "@/lib/id-generator";

import { MI_ACCESO_STATUS_LABELS, MI_ACCESO_TYPE_LABELS } from "./mi-acceso.constants";
import type {
  MiAccesoCollaborator,
  MiAccesoCustomSystemAccess,
  MiAccesoRequest,
  MiAccesoRequestDraft,
  MiAccesoRequestStatus,
  MiAccesoSystemAccess,
} from "./mi-acceso.types";

function padRequestSequence(value: number) {
  return value.toString().padStart(3, "0");
}

export function mapCollaboratorToMiAccesoCollaborator(collaborator: CollaboratorResult): MiAccesoCollaborator {
  return {
    id: collaborator.id,
    name: collaborator.name,
    username: collaborator.username,
    position: collaborator.role?.role ?? "Sin puesto",
    area: collaborator.areas?.[0]?.name ?? "Sin área",
    agency: collaborator.agency?.name ?? "Sin agencia",
    email: collaborator.email,
    isActive: collaborator.is_active,
  };
}

export function mapUserBriefToMiAccesoCollaborator(user: UserBriefApi): MiAccesoCollaborator {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    position: user.role_name || "Sin puesto",
    area: user.area_name || "Sin área",
    agency: user.agency_name || "Sin agencia",
    email: user.email,
    isActive: true,
  };
}

export function buildMiAccesoRequestCode(existingRequests: MiAccesoRequest[]) {
  const currentYear = new Date().getFullYear();
  const yearRequests = existingRequests.filter((request) => request.code.includes(`REQ-${currentYear}-`));
  return `REQ-${currentYear}-${padRequestSequence(yearRequests.length + 1)}`;
}

export function buildMiAccesoRequestDetail(request: MiAccesoRequest) {
  const selectedSystems = [...request.systems, ...request.customSystems].filter(
    (system) => system.reference || system.observation.trim().length > 0,
  );

  if (selectedSystems.length === 0) {
    return request.additionalRequirement.trim() || "Sin detalle adicional";
  }

  const names = selectedSystems.map((system) => system.systemName);

  if (names.length === 1) {
    return `Sistema: ${names[0]}`;
  }

  if (names.length === 2) {
    return `Sistemas: ${names[0]} y ${names[1]}`;
  }

  return `Sistemas: ${names[0]}, ${names[1]} y ${names.length - 2} más`;
}

export function buildMiAccesoRequestFromDraft(
  draft: MiAccesoRequestDraft,
  existingRequests: MiAccesoRequest[],
): MiAccesoRequest {
  return {
    id: `mi-acceso-${generateTempId()}`,
    code: buildMiAccesoRequestCode(existingRequests),
    type: draft.type,
    collaborator: draft.collaborator,
    manager: draft.manager,
    systems: draft.systems,
    customSystems: draft.customSystems,
    additionalRequirement: draft.additionalRequirement.trim(),
    status: "registrado",
    createdAt: new Date().toISOString(),
    pdfAvailable: false,
  };
}

export function createEmptySystemAccess(systemName = ""): MiAccesoSystemAccess {
  return {
    systemId: null,
    systemName,
    reference: null,
    observation: "",
  };
}

export function createEmptyCustomSystemAccess(): MiAccesoCustomSystemAccess {
  return {
    localId: `custom-${generateTempId()}`,
    systemId: null,
    systemName: "",
    reference: null,
    observation: "",
  };
}

export function getMiAccesoStatusCount(requests: MiAccesoRequest[], status: MiAccesoRequestStatus) {
  return requests.filter((request) => request.status === status).length;
}

export function getMiAccesoRequestTypeLabel(type: MiAccesoRequest["type"]) {
  return MI_ACCESO_TYPE_LABELS[type];
}

export function getAccessRequestTypeDisplay(
  request: Pick<AccessRequestDetailApi, "request_type" | "request_type_display" | "absence_type">,
) {
  if (request.request_type === "vacaciones") {
    if (request.absence_type === "suspension") {
      return "Suspensión";
    }

    if (request.absence_type === "bloqueo_vacaciones") {
      return MI_ACCESO_TYPE_LABELS.vacaciones;
    }
  }

  return request.request_type_display || MI_ACCESO_TYPE_LABELS[request.request_type];
}

export function getMiAccesoStatusLabel(status: MiAccesoRequestStatus) {
  return MI_ACCESO_STATUS_LABELS[status];
}

export function mapAccessRequestDetailToMiAccesoRequest(request: AccessRequestDetailApi): MiAccesoRequest {
  const systemLines = Array.isArray(request.system_lines) ? request.system_lines : [];

  return {
    id: request.id,
    code: request.code,
    type: request.request_type,
    collaborator: mapUserBriefToMiAccesoCollaborator(request.subject),
    manager: request.boss ? mapUserBriefToMiAccesoCollaborator(request.boss) : null,
    systems: systemLines.map((systemLine) => ({
      systemId: systemLine.system_id,
      systemName: systemLine.system.name,
      reference: systemLine.reference_user ? mapUserBriefToMiAccesoCollaborator(systemLine.reference_user) : null,
      observation: systemLine.access_observation ?? "",
    })),
    customSystems: [],
    additionalRequirement: request.additional_detail?.trim() || request.detail_summary || "",
    status: request.status,
    createdAt: request.created_at,
    pdfAvailable: Boolean(request.pdf_download_url),
  };
}
