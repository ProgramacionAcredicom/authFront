import { format, subDays } from "date-fns";

import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";
import type {
  MovementAssignmentDisplay,
  MovementLogApi,
  MovementLogRow,
  MovementLogType,
  MovementReportEmailPayload,
  MovementUserBasic,
} from "@/interfaces/movements.interfaces";

export interface MovementReportRange {
  fechaInicio: string;
  fechaFin: string;
}

export function getRecentMovementsRange(now = new Date()): MovementReportRange {
  return {
    fechaInicio: format(subDays(now, 6), "yyyy-MM-dd"),
    fechaFin: format(now, "yyyy-MM-dd"),
  };
}

const ASSIGNMENT_FALLBACKS = {
  current: "Sin asignación actual",
  next: "Sin nueva asignación",
} as const;
const LEGACY_EMPTY_ASSIGNMENT_VALUES = new Set(["sin valor actual", "sin nuevo valor", "sin asignación actual", "sin nueva asignación"]);

function humanizeKey(value: string) {
  return value.replace(/_/g, " ");
}

function normalizeAssignmentKey(value: string): keyof Omit<MovementAssignmentDisplay, "fallbackText"> | null {
  const normalized = value.trim().toLowerCase();

  if (normalized === "agency" || normalized === "agencia") {
    return "agency";
  }

  if (normalized === "role" || normalized === "puesto") {
    return "role";
  }

  return null;
}

function stripAssignmentPrefix(value: string, key: keyof Omit<MovementAssignmentDisplay, "fallbackText">) {
  const trimmed = value.trim();

  if (key === "agency") {
    return trimmed
      .replace(/^agency\s*:\s*/i, "")
      .replace(/^agencia\s*:\s*/i, "")
      .replace(/^agencia\s+/i, "")
      .trim();
  }

  return trimmed
    .replace(/^role\s*:\s*/i, "")
    .replace(/^puesto\s*:\s*/i, "")
    .replace(/^puesto\s+/i, "")
    .trim();
}

function formatUnknownValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatUnknownValue(item))
      .filter(Boolean)
      .join(" • ");
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([key, entryValue]) => {
        const formattedValue = formatUnknownValue(entryValue);
        return formattedValue ? `${humanizeKey(key)}: ${formattedValue}` : "";
      })
      .filter(Boolean);

    return entries.join(" • ");
  }

  return "";
}

function normalizeMovementValue(value: unknown, fallback: string) {
  const formattedValue = formatUnknownValue(value);
  return formattedValue || fallback;
}

function buildAssignmentDisplayText(assignment: MovementAssignmentDisplay, fallback: string) {
  const parts = [
    assignment.agency ? `Agencia: ${assignment.agency}` : "",
    assignment.role ? `Puesto: ${assignment.role}` : "",
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" • ");
  }

  return assignment.fallbackText || fallback;
}

function normalizeMovementAssignment(value: unknown, fallback: string): MovementAssignmentDisplay {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const objectValue = value as Record<string, unknown>;
    const agency = "agency" in objectValue ? stripAssignmentPrefix(formatUnknownValue(objectValue.agency), "agency") : "";
    const role = "role" in objectValue ? stripAssignmentPrefix(formatUnknownValue(objectValue.role), "role") : "";
    const structuredAssignment: MovementAssignmentDisplay = {
      ...(agency ? { agency } : {}),
      ...(role ? { role } : {}),
    };

    if (structuredAssignment.agency || structuredAssignment.role) {
      return structuredAssignment;
    }

    return {
      fallbackText: normalizeMovementValue(value, fallback),
    };
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed || LEGACY_EMPTY_ASSIGNMENT_VALUES.has(trimmed.toLowerCase())) {
      return { fallbackText: fallback };
    }

    const tokenizedAssignment = trimmed
      .split("•")
      .map((token) => token.trim())
      .filter(Boolean)
      .reduce<MovementAssignmentDisplay>((accumulator, token) => {
        const separatorIndex = token.indexOf(":");
        if (separatorIndex === -1) {
          return accumulator;
        }

        const rawKey = token.slice(0, separatorIndex);
        const rawValue = token.slice(separatorIndex + 1);
        const normalizedKey = normalizeAssignmentKey(rawKey);
        const normalizedValue = normalizedKey ? stripAssignmentPrefix(rawValue, normalizedKey) : "";

        if (normalizedKey && normalizedValue) {
          accumulator[normalizedKey] = normalizedValue;
        }

        return accumulator;
      }, {});

    if (tokenizedAssignment.agency || tokenizedAssignment.role) {
      return tokenizedAssignment;
    }

    if (trimmed.includes("/")) {
      const [agencyRaw, ...roleSegments] = trimmed
        .split("/")
        .map((segment) => segment.trim())
        .filter(Boolean);
      const roleRaw = roleSegments.join(" / ").trim();

      const agency = agencyRaw ? stripAssignmentPrefix(agencyRaw, "agency") : "";
      const role = roleRaw ? stripAssignmentPrefix(roleRaw, "role") : "";

      if (agency || role) {
        return {
          ...(agency ? { agency } : {}),
          ...(role ? { role } : {}),
        };
      }
    }

    return {
      fallbackText: trimmed,
    };
  }

  return {
    fallbackText: normalizeMovementValue(value, fallback),
  };
}

function normalizeMovementUser(user: MovementUserBasic | null | undefined, fallbackName: string, fallbackUsername: string) {
  return {
    name: typeof user?.name === "string" && user.name.trim() ? user.name.trim() : fallbackName,
    username: typeof user?.username === "string" && user.username.trim() ? user.username.trim() : fallbackUsername,
  };
}

export function mapMovementLog(apiMovement: MovementLogApi): MovementLogRow {
  const affectedUser = normalizeMovementUser(apiMovement.affected_user, "Sin usuario afectado", "sin-username");
  const createdBy = normalizeMovementUser(apiMovement.created_by, "Sistema", "sistema");
  const currentAssignment = normalizeMovementAssignment(apiMovement.current_value, ASSIGNMENT_FALLBACKS.current);
  const newAssignment = normalizeMovementAssignment(apiMovement.new_value, ASSIGNMENT_FALLBACKS.next);

  return {
    id: apiMovement.id,
    tipoAccion: apiMovement.tipo_accion,
    fechaAccion: apiMovement.fecha_accion,
    currentAssignment,
    newAssignment,
    currentValue: buildAssignmentDisplayText(currentAssignment, ASSIGNMENT_FALLBACKS.current),
    newValue: buildAssignmentDisplayText(newAssignment, ASSIGNMENT_FALLBACKS.next),
    affectedUserName: affectedUser.name,
    affectedUsername: affectedUser.username,
    createdByName: createdBy.name,
    createdByUsername: createdBy.username,
    comment: normalizeMovementValue(apiMovement.comment, "Sin observaciones"),
    isApply: apiMovement.is_apply,
  };
}

export function mapMovementLogs(apiMovements: MovementLogApi[]) {
  return apiMovements.map(mapMovementLog);
}

export function buildMovementReportPayload(
  range: MovementReportRange,
  collaborators: CollaboratorResult[],
  tipos: MovementLogType[],
): MovementReportEmailPayload {
  const payload: MovementReportEmailPayload = {
    fecha_inicio: range.fechaInicio,
    fecha_fin: range.fechaFin,
    colaborador_ids: collaborators.map((collaborator) => collaborator.id),
  };

  if (tipos.length > 0) {
    payload.tipo = tipos;
  }

  return payload;
}
