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
import { Ellipsis, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CellActionsGruposProps {
  id: number;
  onEdit?: (id: number) => void;
}

export const CellActionsGrupos = ({ id, onEdit }: CellActionsGruposProps) => {
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
            <Link to={`/grupos/editar/${id}`} className="flex items-center gap-2">
              <Edit className="size-4" /> Editar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/grupos/eliminar/${id}`} state={{ modal: true }} className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-4" /> Eliminar
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

