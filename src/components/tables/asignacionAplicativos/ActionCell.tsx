// ActionCell.tsx
import { Link, useLocation } from "react-router-dom";
import { Edit, Ellipsis } from "lucide-react";
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

export function ActionCell({ id }: { id: number }) {
  const location = useLocation(); // ← ¡ahora sí es serializable!

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
            <Link
              to={`editar/${id}`} // relativo ⇒ /aplicativos/editar/:id
              state={{ backgroundLocation: location }} // 🔸 necesario para el overlay
              className="flex items-center gap-2"
            >
              <Edit className="size-4" /> Editar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
