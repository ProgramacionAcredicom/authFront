import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Result } from "@/interfaces/colaboradores.interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { Crown, Lock, LockOpen, Search, UserRound } from "lucide-react";
import { ActionsCell } from "./actions-cell";
import { Badge } from "@/components/ui/badge";

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
      const { name, username, is_active, is_blocked, is_staff, is_superuser } = row.original;
      return (
        <div className={`flex flex-col ${!is_active ? "opacity-50" : ""}`}>
          <span className="font-medium">{name || "N/A"}</span>
          <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            {!is_active && <span className="size-2 rounded-full bg-red-500" />}
            <div className="flex items-center gap-1.5">
              <span>{username || "N/A"}</span>
              <span
                aria-label={is_blocked ? "Usuario bloqueado" : "Usuario desbloqueado"}
                className={is_blocked ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"}
              >
                {is_blocked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
              </span>
            </div>
            {is_staff && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 text-xs px-1.5 py-0.5 h-5 font-medium"
              >
                Staff
              </Badge>
            )}
            {is_superuser && (
              <Badge
                variant="secondary"
                className="bg-yellow-300 text-yellow-900 border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 text-xs px-1.5 py-0.5 h-5 flex items-center gap-0.5 font-medium"
              >
                <Crown className="h-2.5 w-2.5" />
              </Badge>
            )}
          </div>
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
