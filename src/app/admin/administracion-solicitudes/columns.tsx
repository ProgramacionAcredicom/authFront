import type { ColumnDef } from "@tanstack/react-table";
import { Download, Loader2, RefreshCcw, Search } from "lucide-react";

import { MI_ACCESO_STATUS_LABELS, MI_ACCESO_TYPE_LABELS } from "@/app/admin/mis-solicitudes/mi-acceso.constants";
import { MiAccesoStatusBadge } from "@/app/admin/mis-solicitudes/mi-acceso-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

import type { MiAccesoAdminRequestRow } from "./mi-acceso-administration.types";
import { formatAdminRequestDate } from "./mi-acceso-administration.utils";

interface AdminMiAccesoColumnsOptions {
  canViewRequestPdf?: boolean;
  canChangeStatus?: boolean;
  downloadingRequestId?: number | null;
  isDownloadingPdf?: boolean;
  onDownloadPdf: (request: MiAccesoAdminRequestRow) => void;
  onOpenStatusDialog: (request: MiAccesoAdminRequestRow) => void;
}

function renderUserCell({ name, secondary }: { name: string; secondary?: string }) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className="font-medium">{name}</span>
      {secondary ? <span className="text-sm text-muted-foreground">{secondary}</span> : null}
    </div>
  );
}

function renderDetailCell({ detailSummary, additionalDetail }: { detailSummary: string; additionalDetail: string }) {
  return (
    <div className="flex max-w-md flex-col gap-2 whitespace-normal">
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Resumen</span>
        <span className="text-sm font-medium wrap-break-word">{detailSummary}</span>
      </div>
      {additionalDetail ? (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Detalle adicional</span>
          <span className="text-sm font-medium wrap-break-word">{additionalDetail}</span>
        </div>
      ) : null}
    </div>
  );
}

export const getAdminMiAccesoColumns = ({
  canViewRequestPdf = false,
  canChangeStatus = false,
  downloadingRequestId,
  isDownloadingPdf = false,
  onDownloadPdf,
  onOpenStatusDialog,
}: AdminMiAccesoColumnsOptions): ColumnDef<MiAccesoAdminRequestRow>[] => {
  const columns: ColumnDef<MiAccesoAdminRequestRow>[] = [
    {
      id: "code",
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
      cell: ({ row }) => <span className="font-semibold">{row.original.code}</span>,
      enableColumnFilter: true,
      meta: {
        label: "Código",
        placeholder: "Buscar código, solicitante o colaborador...",
        variant: "text",
        icon: Search,
      },
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
      cell: ({ row }) => <Badge variant="outline">{row.original.typeLabel}</Badge>,
      enableColumnFilter: true,
      meta: {
        label: "Tipo",
        variant: "select",
        options: Object.entries(MI_ACCESO_TYPE_LABELS).map(([value, label]) => ({ label, value })),
      },
    },
    {
      accessorKey: "requesterName",
      header: "Solicitante",
      cell: ({ row }) => renderUserCell({ name: row.original.requesterName, secondary: row.original.requesterUsername ? `@${row.original.requesterUsername}` : undefined }),
      meta: {
        label: "Solicitante",
      },
    },
    {
      accessorKey: "subjectName",
      header: "Colaborador",
      cell: ({ row }) => renderUserCell({ name: row.original.subjectName, secondary: row.original.subjectPosition }),
      meta: {
        label: "Colaborador",
      },
    },
    {
      id: "details",
      accessorFn: (row) => `${row.detailSummary} ${row.additionalDetail}`.trim(),
      header: "Detalle",
      cell: ({ row }) => renderDetailCell({ detailSummary: row.original.detailSummary, additionalDetail: row.original.additionalDetail }),
      meta: {
        label: "Detalle",
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row }) => <MiAccesoStatusBadge status={row.original.status} />,
      enableColumnFilter: true,
      meta: {
        label: "Estado",
        variant: "select",
        options: Object.entries(MI_ACCESO_STATUS_LABELS).map(([value, label]) => ({ label, value })),
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha de creación" />,
      cell: ({ row }) => <span className="text-sm font-medium">{formatAdminRequestDate(row.original.createdAt)}</span>,
      meta: {
        label: "Fecha de creación",
      },
    },
  ];

  if (canViewRequestPdf || canChangeStatus) {
    columns.push({
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex flex-col items-start gap-1">
          {canViewRequestPdf ? (
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 py-0"
              onClick={() => onDownloadPdf(row.original)}
              disabled={isDownloadingPdf && downloadingRequestId === row.original.id}
            >
              {isDownloadingPdf && downloadingRequestId === row.original.id ? (
                <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />
              ) : (
                <Download data-icon="inline-start" aria-hidden="true" />
              )}
              Descargar PDF
            </Button>
          ) : null}

          {canChangeStatus ? (
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 py-0"
              onClick={() => onOpenStatusDialog(row.original)}
            >
              <RefreshCcw data-icon="inline-start" aria-hidden="true" />
              Cambiar estado
            </Button>
          ) : null}
        </div>
      ),
      meta: {
        label: "Acciones",
      },
    });
  }

  return columns;
};
