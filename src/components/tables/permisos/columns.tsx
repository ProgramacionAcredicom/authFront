import { ColumnDef } from "@tanstack/react-table";
import { ResultModel } from "@/interfaces/permisos.interfaces";
import { CellActionsPermisos } from "./cell-actions-permisos";
import { Search } from "lucide-react";

export const columns: ColumnDef<ResultModel>[] = [
  {
    accessorKey: "aplicativo",
    header: "Aplicativo",
    cell: ({ row }) => {
      const data = row.original;
      if ("aplicativo" in data && typeof data.aplicativo === "object") {
        return <div className="font-medium">{data.aplicativo.nombre}</div>;
      }
      return <div>-</div>;
    },
    meta: {
      label: "Aplicativo",
    },
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.nombre}</div>;
    },
    enableColumnFilter: true,
    meta: {
      label: "Buscar",
      placeholder: "Buscar por nombre o descripción...",
      variant: "text",
      icon: Search,
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground">{row.original.descripcion || "-"}</div>;
    },
    meta: {
      label: "Descripción",
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return <CellActionsPermisos id={row.original.id} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];

