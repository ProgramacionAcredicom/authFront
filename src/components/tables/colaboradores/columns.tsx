import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Result, UserType } from "@/interfaces/colaboradores.interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { Airplay, Blocks, Edit, Ellipsis, Folder, School, Shrub, UserRound, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "id",
    header: "No.",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },

  {
    accessorKey: "username",
    header: "Usuario",
  },
  {
    accessorKey: "email",
    header: "Correo",
  },
  {
    accessorKey: "user_type",
    header: "Cuenta",
    cell: ({ row }) => {
      const iconMap = {
        [UserType.Usuario]: UserRound,
        [UserType.Kiosco]: Airplay,
        [UserType.Consejo]: Users,
        [UserType.ProyectoDialogo]: Folder,
        [UserType.Pradera]: School,
        [UserType.ProyectoForestal]: Shrub,
        [UserType.Otro]: Blocks,
      } as const;

      const Icon = iconMap[row.original.user_type];
      return Icon ? <Icon className="size-4" /> : null;
    },
  },
  {
    accessorKey: "dpi",
    header: "DPI",
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const { is_active } = row.original;
      if (is_active) {
        return <Checkbox checked={true} />;
      }
      return <Checkbox checked={false} />;
    },
  },
  {
    accessorKey: "actions",
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
              <DropdownMenuItem>
                <Edit className="size-4" />
                <Link to={`/colaboradores/editar/${id}`} className="w-full">
                  Editar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
