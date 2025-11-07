import { ColumnDef } from "@tanstack/react-table";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { CellActionsGrupos } from "./cell-actions-grupos";

export const columnsGrupos: ColumnDef<GruposTypeModel>[] = [
  {
    accessorKey: "aplicativos",
    header: "Aplicativos",
    cell: ({ row }) => {
      const aplicativos = row.original?.aplicativos;
      if (aplicativos && aplicativos.length > 0) {
        return <div className="font-medium">{aplicativos.map((a) => a.nombre).join(", ")}</div>;
      }
      return <div>-</div>;
    },
    meta: {
      label: "Aplicativos",
    },
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.nombre}</div>;
    },
    meta: {
      label: "Nombre",
    },
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">{row.original.state ? "Activo" : "Inactivo"}</div>
      );
    },
    meta: {
      label: "Estado",
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return <CellActionsGrupos id={row.original.id} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];

