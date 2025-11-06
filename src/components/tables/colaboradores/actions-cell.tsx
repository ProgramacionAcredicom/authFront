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
import { Result } from "@/interfaces/colaboradores.interfaces";
import { Edit, Ellipsis, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ModalAdminSesiones } from "@/components/modal/sessions/modal-admin-sesiones";

interface ActionsCellProps {
  data: Result;
}

export const ActionsCell = ({ data }: ActionsCellProps) => {
  const { id, is_active, name } = data;
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  return (
    <div className={!is_active ? "opacity-50" : ""} onClick={(e) => e.stopPropagation()}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-3xs" side="right" align="start" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to={`/colaboradores/editar/${id}`} className="flex w-full items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Edit className="size-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsSessionModalOpen(true)}>
              <Shield className="size-4" />
              Administrar Sesiones
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalAdminSesiones
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        userId={id}
        userName={name || "Usuario"}
      />
    </div>
  );
};

