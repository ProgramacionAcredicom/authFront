import { ColumnDef } from "@tanstack/react-table";
import { Result } from "@/interfaces/permisos.interfaces";
import { CellActions } from "./cell-actions";

// columnsPermisosPorGrupo.ts
export const columnsPermisosPorGrupo: ColumnDef<Result>[] = [
  {
    accessorKey: "aplicativo",
    header: "Aplicativos",
    cell: ({ row }) => {
      const data = row.original;
      if ("aplicativo" in data && typeof data.aplicativo === "string") {
        return <div className="flex flex-col gap-2">{data.aplicativo}</div>;
      }
      if ("aplicativo" in data && typeof data.aplicativo === "object") {
        return <div className="flex flex-col gap-2">{data.aplicativo.nombre}</div>;
      }
      return <div className="flex flex-col gap-2">-</div>;
    },
  },
  {
    accessorKey: "permiso",
    header: "Permisos",
    cell: ({ row }) => {
      const data = row.original;
      return <div>{data.permiso}</div>;
    },
  },
  {
    id: "status",
    header: "Acciones",
    cell: ({ row }) => {
      const data = row.original;
      return <CellActions id={data.id} />;
    },
  },
];
