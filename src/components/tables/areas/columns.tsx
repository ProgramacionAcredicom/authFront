import { Result } from "@/interfaces/areas.interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { Circle, CircleCheck } from "lucide-react";

export const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      if (row.original) {
        return (
          <div>
            <CircleCheck className="size-4 text-green-500" />
          </div>
        );
      }
      return (
        <div>
          <Circle className="size-4 text-gray-400" />
        </div>
      );
    },
  },
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "no_colaboradores",
    header: "Usuarios",
  },
];
