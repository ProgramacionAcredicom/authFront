import { ColumnDef } from "@tanstack/react-table";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CellActions } from "./cell-actions";

export const columns: ColumnDef<GruposTypeModel>[] = [
  {
    accessorKey: "aplicativo",
    header: "Aplicativo",
    cell: ({ row }) => {
      return <p>{row.original?.aplicativos?.map((aplicativo) => aplicativo?.nombre).join(", ") || "N/A"}</p>;
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
    accessorKey: "status",
    header: ({ table }) => (
      <div className="mr-2 flex items-center gap-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
          id="status"
        />
        <Label className="text-white" htmlFor="status">
          Estado
        </Label>
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Seleccionar fila" />
    ),
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
