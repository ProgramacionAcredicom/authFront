import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type { AuditAction, AuditLogRow, AuditModule } from "@/interfaces/auditoria.interfaces";

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  create: "Creación",
  update: "Actualización",
  delete: "Eliminación",
  login: "Inicio sesión",
  logout: "Cierre sesión",
  login_failed: "Login fallido",
};

const ACTION_STYLES: Record<AuditAction, string> = {
  create: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  update: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
  delete: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  login: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  logout: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800",
  login_failed: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

export const AUDIT_MODULE_LABELS: Record<AuditModule, string> = {
  auth: "Autenticación",
  users: "Usuarios",
  access: "Accesos",
  system: "Sistema",
};

export function formatAuditDate(value: string) {
  if (!value) return "N/A";

  try {
    return format(parseISO(value), "dd MMM yyyy, HH:mm", { locale: es });
  } catch {
    return value;
  }
}

export const AUDIT_ACTION_OPTIONS = Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => ({ label, value }));
export const AUDIT_MODULE_OPTIONS = Object.entries(AUDIT_MODULE_LABELS).map(([value, label]) => ({ label, value }));
export const AUDIT_SUCCESS_OPTIONS = [
  { label: "Exitoso", value: "true" },
  { label: "Fallido", value: "false" },
];

export const auditColumns: ColumnDef<AuditLogRow>[] = [
  {
    accessorKey: "id",
    header: "No.",
    size: 70,
    maxSize: 90,
    meta: {
      label: "No.",
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => <span className="font-medium">{formatAuditDate(row.original.createdAt)}</span>,
    meta: {
      label: "Fecha",
    },
  },
  {
    accessorKey: "actor",
    header: "Actor",
    cell: ({ row }) => <span className="font-medium">{row.original.actor}</span>,
    meta: {
      label: "Actor",
    },
  },
  {
    accessorKey: "action",
    header: "Acción",
    cell: ({ row }) => (
      <Badge variant="secondary" className={ACTION_STYLES[row.original.action]}>
        {AUDIT_ACTION_LABELS[row.original.action]}
      </Badge>
    ),
    meta: {
      label: "Acción",
    },
  },
  {
    accessorKey: "module",
    header: "Módulo",
    cell: ({ row }) => <Badge variant="outline">{AUDIT_MODULE_LABELS[row.original.module]}</Badge>,
    meta: {
      label: "Módulo",
    },
  },
  {
    accessorKey: "resourceLabel",
    header: "Recurso",
    cell: ({ row }) => (
      <div className="flex min-w-52 max-w-72 flex-col whitespace-normal">
        <span className="font-medium">{row.original.resourceLabel}</span>
        <span className="text-sm text-muted-foreground">
          {row.original.resourceType} · {row.original.resourceId}
        </span>
      </div>
    ),
    meta: {
      label: "Recurso",
    },
  },
  {
    accessorKey: "path",
    header: "Ruta",
    cell: ({ row }) => (
      <div className="flex min-w-60 max-w-96 flex-col whitespace-normal">
        <span className="font-medium">{row.original.path}</span>
        <span className="text-sm text-muted-foreground">{row.original.httpMethod} · HTTP {row.original.statusCode}</span>
      </div>
    ),
    meta: {
      label: "Ruta",
    },
  },
  {
    accessorKey: "success",
    header: "Resultado",
    cell: ({ row }) =>
      row.original.success ? (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
          Exitoso
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800">
          Fallido
        </Badge>
      ),
    meta: {
      label: "Resultado",
    },
  },
  {
    accessorKey: "metadataSummary",
    header: "Metadata",
    cell: ({ row }) => <span className="block max-w-72 whitespace-normal wrap-break-word text-sm">{row.original.metadataSummary}</span>,
    meta: {
      label: "Metadata",
    },
  },
];
