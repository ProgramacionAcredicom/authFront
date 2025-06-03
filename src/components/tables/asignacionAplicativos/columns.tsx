import { ColumnDef } from "@tanstack/react-table";
import { TypographyMuted, TypographyP } from "@/components/ui/typography";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import { Link } from "react-router-dom";
import { Edit, Ellipsis, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
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
    accessorKey: "state",
    header: "Estado",
    cell: ({ row }) => {
      const data = row.original;
      console.log(data);
      if (data.state) {
        return <Checkbox checked={true} />;
      }
      return <Checkbox checked={false} />;
    },
  },
  {
    id: "status",
    header: "Acciones",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-3xs" side="right" align="start">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={`editar/${id}`} state={{ modal: true }} className="flex items-center gap-2">
                  <Edit className="size-4" /> Editar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DropdownMenuItem asChild>
                <Link to={`eliminar/${id}`} state={{ modal: true }} className="flex items-center gap-2">
                  <Trash className="size-4" /> Eliminar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
