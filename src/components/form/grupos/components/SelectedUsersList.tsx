import { TypographyMuted } from "@/components/ui/typography";
import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";
import { SelectedUserBadge } from "./SelectedUserBadge";

interface SelectedUsersListProps {
  users: ColaboradorResult[];
  onRemoveUser: (userId: number) => void;
}

/**
 * Componente para mostrar la lista de usuarios seleccionados
 */
export function SelectedUsersList({ users, onRemoveUser }: SelectedUsersListProps) {
  if (users.length === 0) {
    return (
      <div className="flex h-full min-h-32 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50">
        <div className="flex flex-col items-center gap-2 text-center">
          <TypographyMuted text="No hay usuarios seleccionados" className="text-base" />
          <TypographyMuted
            text="Usa el selector arriba para agregar usuarios. Usa Cmd/Ctrl para selección múltiple."
            className="text-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {users.map((user) => (
        <SelectedUserBadge key={user.id} user={user} onRemove={() => onRemoveUser(user.id)} />
      ))}
    </div>
  );
}

