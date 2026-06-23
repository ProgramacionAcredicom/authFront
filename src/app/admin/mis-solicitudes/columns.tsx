import type { ColumnDef } from "@tanstack/react-table";
import { Download, Loader2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { MiAccesoStatusBadge } from "./mi-acceso-status-badge";
import { canDownloadMiAccesoRequestPdf, MI_ACCESO_TYPE_LABELS } from "./mi-acceso.constants";
import { buildMiAccesoRequestDetail } from "./mi-acceso.utils";
import type { MiAccesoRequest } from "./mi-acceso.types";

interface MiAccesoColumnsOptions {
  canViewRequestPdf?: boolean;
  downloadingRequestId?: number | null;
  isDownloadingPdf?: boolean;
  onDownloadPdf: (request: MiAccesoRequest) => void;
}

function renderMiAccesoRequestDetailsCell(request: MiAccesoRequest) {
  const systemNames = [...request.systems, ...request.customSystems]
    .map((system) => system.systemName.trim())
    .filter(Boolean);
  const additionalDetail = request.additionalRequirement.trim();

  if (systemNames.length === 0 && !additionalDetail) {
    return <span className="block max-w-md text-sm text-muted-foreground">Sin detalle adicional</span>;
  }

  return (
    <div className="flex max-w-md flex-col gap-2 whitespace-normal">
      {systemNames.length > 0 ? (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            {systemNames.length === 1 ? "Sistema" : "Sistemas"}
          </span>
          <span className="text-sm font-medium wrap-break-word">{systemNames.join(", ")}</span>
        </div>
      ) : null}
      {additionalDetail ? (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Detalle adicional</span>
          <span className="text-sm font-medium wrap-break-word">{additionalDetail}</span>
        </div>
      ) : null}
    </div>
  );
}

export const getMiAccesoColumns = ({
  canViewRequestPdf = false,
  downloadingRequestId,
  isDownloadingPdf = false,
  onDownloadPdf,
}: MiAccesoColumnsOptions): ColumnDef<MiAccesoRequest>[] => {
  const columns: ColumnDef<MiAccesoRequest>[] = [
    {
      id: "search",
      accessorFn: (request) =>
        `${request.code} ${request.collaborator.name} ${request.collaborator.position} ${buildMiAccesoRequestDetail(request)}`,
      header: "Código",
      cell: ({ row }) => <span className="font-semibold">{row.original.code}</span>,
      enableColumnFilter: true,
      meta: {
        label: "Código",
        placeholder: "Buscar código o colaborador...",
        variant: "text",
        icon: Search,
      },
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => <Badge variant="outline">{MI_ACCESO_TYPE_LABELS[row.original.type]}</Badge>,
      meta: {
        label: "Tipo",
      },
    },
    {
      id: "collaborator",
      accessorFn: (request) => `${request.collaborator.name} ${request.collaborator.position}`,
      header: "Colaborador",
      cell: ({ row }) => (
        <div className="flex min-w-0 flex-col">
          <span className="font-medium">{row.original.collaborator.name}</span>
          <span className="text-sm text-muted-foreground">{row.original.collaborator.position}</span>
        </div>
      ),
      meta: {
        label: "Colaborador",
      },
    },
    {
      id: "details",
      accessorFn: (request) => buildMiAccesoRequestDetail(request),
      header: "Detalles del requerimiento",
      cell: ({ row }) => renderMiAccesoRequestDetailsCell(row.original),
      meta: {
        label: "Detalles del requerimiento",
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <MiAccesoStatusBadge status={row.original.status} />,
      meta: {
        label: "Estado",
      },
    },
  ];

  if (canViewRequestPdf) {
    columns.push({
      id: "actions",
      header: "Acciones",
      cell: ({ row }) =>
        canDownloadMiAccesoRequestPdf(row.original.type) ? (
          <Button
            type="button"
            variant="link"
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
        ) : null,
      meta: {
        label: "Acciones",
      },
    });
  }

  return columns;
};
