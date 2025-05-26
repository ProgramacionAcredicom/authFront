import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Airplay, Blocks, Edit, Ellipsis, Folder, School, Shrub, Text, UserRound, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "id",
    header: "No.",
    meta: {
      label: "No.",
    },
  },
  {
    accessorKey: "picture",
    header: "Foto",
    cell: ({ row }) => {
      const { picture } = row.original;
      return (
        <Avatar>
          {picture ? (
            <AvatarImage src={picture} alt="Foto" />
          ) : (
            <AvatarFallback>
              <UserRound className="size-4" />
            </AvatarFallback>
          )}
        </Avatar>
      );
    },
    meta: {
      label: "Foto",
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    enableColumnFilter: true,
    meta: {
      label: "Nombre",
    },
  },

  {
    accessorKey: "username",
    header: "Usuario",
    meta: {
      label: "Usuario",
      placeholder: "Buscar...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "email",
    header: "Correo",
    enableColumnFilter: true,
    meta: {
      label: "Correo",
    },
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
    meta: {
      label: "Cuenta",
    },
  },
  {
    accessorKey: "dpi",
    header: "DPI",
    enableColumnFilter: true,
    meta: {
      label: "DPI",
    },
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
    meta: {
      label: "Estado",
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
                <Link to={`/colaboradores/editar/${id}`} className="flex w-full items-center gap-2">
                  <Edit className="size-4" />
                  Editar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: {
      label: "Acciones",
    },
  },
];
