import type { AuditLogRow } from "@/interfaces/auditoria.interfaces";
import { AUDIT_ACTION_LABELS, AUDIT_MODULE_LABELS, formatAuditDate } from "@/components/tables/auditoria/columns";

function getSuccessLabel(value: boolean) {
  return value ? "Exitoso" : "Fallido";
}

export async function exportAuditoriaToXlsx(rows: AuditLogRow[]) {
  const XLSX = await import("xlsx/xlsx.mjs");

  const exportRows = rows.map((row) => ({
    "No.": row.id,
    Fecha: formatAuditDate(row.createdAt),
    Actor: row.actor,
    Acción: AUDIT_ACTION_LABELS[row.action],
    Módulo: AUDIT_MODULE_LABELS[row.module],
    "Tipo de recurso": row.resourceType,
    "ID de recurso": row.resourceId,
    "Etiqueta de recurso": row.resourceLabel,
    "Método HTTP": row.httpMethod,
    Ruta: row.path,
    "Código de estado": row.statusCode,
    Resultado: getSuccessLabel(row.success),
    Metadata: row.metadataSummary,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Bitácora");
  XLSX.writeFile(workbook, "bitacora_auditoria.xlsx");
}
