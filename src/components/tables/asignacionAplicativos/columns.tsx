import { ColumnDef } from "@tanstack/react-table";
import { TypographyMuted, TypographyP } from "@/components/ui/typography";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import { ActionCell } from "./ActionCell";
// columnsAllPermisos.ts
export const columnsAplicativos: ColumnDef<AplicativosTypeModel>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const data = row.original;
      return <TypographyMuted text={data.nombre} className="font-bold" />;
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => {
      const data = row.original;
      return <TypographyP text={data.descripcion} />;
    },
  },
  {
    id: "status",
    header: "Acciones",
    cell: ({ row }) => {
      return <ActionCell data={row.original} />;
    },
  },
];
