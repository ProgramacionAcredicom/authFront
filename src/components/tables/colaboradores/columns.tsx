import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Result } from "@/interfaces/colaboradores.interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { Search, UserRound } from "lucide-react";
import { ActionsCell } from "./actions-cell";

export const columns: ColumnDef<Result>[] = [
  {
    accessorKey: "id",
    header: "No.",
    size: 50,
    maxSize: 70,
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <span className={!isActive ? "opacity-50" : ""}>
          {row.original.id}
        </span>
      );
    },
    meta: {
      label: "No.",
    },
  },
  // {
  //   accessorKey: "picture",
  //   header: "Foto",
  //   cell: ({ row }) => {
  //     const { picture } = row.original;
  //     return (
  //       <Avatar>
  //         {picture ? (
  //           <AvatarImage src={picture} alt="Foto" />
  //         ) : (
  //           <AvatarFallback>
  //             <UserRound className="size-4" />
  //           </AvatarFallback>
  //         )}
  //       </Avatar>
  //     );
  //   },
  //   meta: {
  //     label: "Foto",
  //   },
  // },
  {
    accessorKey: "picture",
    header: "Foto",
    size: 60,
    maxSize: 60,
    cell: ({ row }) => {
      const { picture, is_active } = row.original;
      return (
        <div className={!is_active ? "opacity-50" : ""}>
          <Avatar>
            {picture ? (
              <AvatarImage src={picture} alt="Foto" />
            ) : (
              <AvatarFallback>
                <UserRound className="size-4" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      );
    },
    meta: {
      label: "Foto",
    },
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const { name, username, is_active } = row.original;
      return (
        <div className={`flex flex-col ${!is_active ? "opacity-50" : ""}`}>
          <span className="font-medium">{name || "N/A"}</span>
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            {!is_active && <span className="size-2 rounded-full bg-red-500" />}
            {username || "N/A"}
          </span>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Nombre",
      placeholder: "Buscar...",
      variant: "text",
      icon: Search,
    },
  },
  {
    accessorKey: "agency",
    header: "Agencia",
    cell: ({ row }) => {
      const { agency, role, is_active } = row.original;
      return (
        <div className={`flex flex-col ${!is_active ? "opacity-50" : ""}`}>
          <span className="font-medium">{agency?.name || "N/A"}</span>
          <span className="text-sm text-muted-foreground">{role?.role || "N/A"}</span>
        </div>
      );
    },
    meta: {
      label: "Agencia",
    },
  },
  {
    accessorKey: "email",
    header: "Correo",
    cell: ({ row }) => {
      const { email, is_active } = row.original;
      return (
        <span className={!is_active ? "opacity-50" : ""}>
          {email}
        </span>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Correo",
    },
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionsCell data={row.original} />,
    meta: {
      label: "Acciones",
    },
  },
];
