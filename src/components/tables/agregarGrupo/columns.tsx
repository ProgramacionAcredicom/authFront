import { ColumnDef } from "@tanstack/react-table";
import { Circle, CircleCheck } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Grupo = {
  grupo: string;
  permiso: string;
  status: "active" | "desactive";
};

export const columns: ColumnDef<Grupo>[] = [
  {
    accessorKey: "aplicativo",
    header: "Aplicativo",
  },
  {
    accessorKey: "grupo",
    header: "Grupo",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      if (row.original.status === "active") {
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
];
