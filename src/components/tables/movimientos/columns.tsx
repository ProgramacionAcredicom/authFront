import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Clock3, Search } from "lucide-react";

import type { MovementLogRow } from "@/interfaces/movements.interfaces";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

const MOVEMENT_TYPE_STYLES: Record<MovementLogRow["tipoAccion"], string> = {
  ALTA: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  BAJA: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  MOVIMIENTO: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
  ROTACION: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

function formatMovementDate(value: string) {
  try {
    return format(parseISO(value), "dd MMM yyyy", { locale: es });
  } catch {
    return value;
  }
}

function MovementAssignmentCell({
  assignment,
  emptyLabel,
}: {
  assignment: MovementLogRow["currentAssignment"];
  emptyLabel: string;
}) {
  if (!assignment.agency && !assignment.role) {
    return <span className="block max-w-55 text-sm text-muted-foreground wrap-break-word">{assignment.fallbackText || emptyLabel}</span>;
  }

  return (
    <div className="flex max-w-55 flex-col gap-2 whitespace-normal">
      {assignment.agency ? (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Agencia</span>
          <span className="text-sm font-medium wrap-break-word">{assignment.agency}</span>
        </div>
      ) : null}

      {assignment.role ? (
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Puesto</span>
          <span className="text-sm font-medium wrap-break-word">{assignment.role}</span>
        </div>
      ) : null}

      {assignment.fallbackText && !assignment.agency && !assignment.role ? (
        <span className="text-sm text-muted-foreground wrap-break-word">{assignment.fallbackText}</span>
      ) : null}
    </div>
  );
}

export const movementColumns: ColumnDef<MovementLogRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="No." />,
    size: 70,
    maxSize: 80,
    meta: {
      label: "No.",
    },
  },
  {
    accessorKey: "fechaAccion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
    cell: ({ row }) => <span className="font-medium">{formatMovementDate(row.original.fechaAccion)}</span>,
    meta: {
      label: "Fecha",
    },
  },
  {
    accessorKey: "tipoAccion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => (
      <Badge variant="secondary" className={MOVEMENT_TYPE_STYLES[row.original.tipoAccion] + " max-w-full whitespace-normal text-center"}>
        {row.original.tipoAccion}
      </Badge>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Tipo",
      variant: "multiSelect",
      options: [  "ALTA", "BAJA", "MOVIMIENTO", "ROTACION"].map((tipo) => ({ label: tipo, value: tipo })),
    },
  },
  {
    accessorKey: "affectedUserName",
    header: "Usuario afectado",
    cell: ({ row }) => (
      <div className="flex min-w-45 max-w-60 flex-col whitespace-normal">
        <span className="font-medium">{row.original.affectedUserName}</span>
        <span className="text-sm text-muted-foreground">@{row.original.affectedUsername}</span>
      </div>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Usuario afectado",
      placeholder: "Buscar colaborador...",
      variant: "text",
      icon: Search,
    },
  },
  {
    accessorKey: "currentValue",
    header: "Asignación actual",
    cell: ({ row }) => <MovementAssignmentCell assignment={row.original.currentAssignment} emptyLabel="Sin asignación actual" />,
    meta: {
      label: "Asignación actual",
    },
  },
  {
    accessorKey: "newValue",
    header: "Nueva asignación",
    cell: ({ row }) => <MovementAssignmentCell assignment={row.original.newAssignment} emptyLabel="Sin nueva asignación" />,
    meta: {
      label: "Nueva asignación",
    },
  },
  {
    accessorKey: "createdByName",
    header: "Registrado por",
    cell: ({ row }) => (
      <div className="flex min-w-55 max-w-65 flex-col whitespace-normal">
        <span className="font-medium">{row.original.createdByName}</span>
        <span className="text-sm text-muted-foreground">@{row.original.createdByUsername}</span>
      </div>
    ),
    meta: {
      label: "Registrado por",
    },
  },
  {
    accessorKey: "isApply",
    header: "Estado",
    cell: ({ row }) =>
      row.original.isApply ? (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="mr-1 size-3" /> Aplicado
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">
          <Clock3 className="mr-1 size-3" /> Pendiente
        </Badge>
      ),
    meta: {
      label: "Estado",
    },
  },
  {
    accessorKey: "comment",
    header: "Observaciones",
    cell: ({ row }) => <span className="block max-w-60 whitespace-normal wrap-break-word">{row.original.comment}</span>,
    meta: {
      label: "Observaciones",
    },
  },
];
