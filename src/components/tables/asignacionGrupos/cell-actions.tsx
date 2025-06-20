import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

export const CellActions = ({ id }: { id: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[999] max-w-3xs" side="right" align="start" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to={`editar/${id}`} state={{ modal: true }} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Edit className="size-4" /> Editar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DropdownMenuItem asChild>
            <Link to={`eliminar/${id}`} state={{ modal: true }} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Trash className="size-4" /> Desactivar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
