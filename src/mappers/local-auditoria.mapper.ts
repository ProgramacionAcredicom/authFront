import type { AuditLogApi, AuditLogRow } from "@/interfaces/auditoria.interfaces";

function normalizeText(value: string | number | boolean | null | undefined, fallback = "N/A") {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
}

function summarizeMetadata(metadata: Record<string, unknown> | null | undefined) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return "Sin metadata adicional";
  }

  return Object.entries(metadata)
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${normalizeText(value, "-")}`)
    .join(" • ");
}

export const localAuditLogMapper = (auditLog: AuditLogApi): AuditLogRow => ({
  id: auditLog.id,
  actor: normalizeText(auditLog.actor, "Sistema"),
  action: auditLog.action,
  module: auditLog.module,
  resourceType: normalizeText(auditLog.resource_type),
  resourceId: normalizeText(auditLog.resource_id),
  resourceLabel: normalizeText(auditLog.resource_label),
  httpMethod: normalizeText(auditLog.http_method),
  path: normalizeText(auditLog.path),
  statusCode: normalizeText(auditLog.status_code),
  success: Boolean(auditLog.success),
  createdAt: normalizeText(auditLog.created_at, ""),
  metadataSummary: summarizeMetadata(auditLog.metadata),
});
