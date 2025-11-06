import { ColumnDef } from "@tanstack/react-table";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CellActions } from "./cell-actions";
import { Button } from "@/components/ui/button";
import { X, Plus, Check } from "lucide-react";

export const columns: ColumnDef<GruposTypeModel>[] = [
  {
    accessorKey: "aplicativo",
    header: "Aplicativo",
    cell: ({ row }) => {
      return <p className="font-medium">{row.original?.aplicativos?.map((aplicativo) => aplicativo?.nombre).join(", ") || "N/A"}</p>;
    },
  },
  {
    accessorKey: "grupo",
    header: "Grupo",
    cell: ({ row }) => {
      return <p className="font-medium">{row.original.nombre}</p>;
    },
  },
  {
    id: "actions",
    header: "Acción",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { addGroup?: (id: number) => void; isGroupSelected?: (id: number) => boolean } | undefined;
      const isSelected = meta?.isGroupSelected?.(row.original.id) ?? false;
      
      return (
        <Button
          variant={isSelected ? "outline" : "custom2"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (!isSelected) {
              meta?.addGroup?.(row.original.id);
            }
          }}
          disabled={isSelected}
          className="gap-2"
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4" />
              Agregado
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Agregar
            </>
          )}
        </Button>
      );
    },
  },
];

export const columnsSelected: ColumnDef<GruposTypeModel>[] = [
  {
    accessorKey: "grupo",
    header: "Grupo",
    cell: ({ row }) => {
      return <p>{row.original.nombre}</p>;
    },
  },
  {
    accessorKey: "aplicativo",
    header: "Aplicativo",
    cell: ({ row }) => {
      return <p>{row.original?.aplicativos?.map((aplicativo) => aplicativo?.nombre).join(", ") || "N/A"}</p>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { removeGroup?: (id: number) => void } | undefined;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            meta?.removeGroup?.(row.original.id);
          }}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      );
    },
  },
];

export const columnsPage: ColumnDef<GruposTypeModel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        disabled={true}
      />
    ),
    cell: ({ row }) => {
      return <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "aplicativos",
    header: "Aplicativos",
    cell: ({ row }) => {
      return <p>{row.original?.aplicativos?.map((aplicativo) => aplicativo?.nombre) || "N/A"}</p>;
    },
  },
  {
    accessorKey: "grupo",
    header: "Grupo",
    cell: ({ row }) => {
      return <p>{row.original.nombre}</p>;
    },
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const { state } = row.original;
      if (state) {
        return <Checkbox checked={true} />;
      }
      return <Checkbox checked={false} />;
    },
  },
  {
    id: "status",
    header: "Acciones",
    cell: ({ row }) => {
      return <CellActions id={row.original.id} />;
    },
  },
];
