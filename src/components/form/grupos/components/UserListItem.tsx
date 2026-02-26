import { Check } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";
import { UserAvatar } from "./UserAvatar";

interface UserListItemProps {
  user: ColaboradorResult;
  isSelected: boolean;
  onSelect: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * Componente para un item individual de usuario en la lista
 */
export function UserListItem({ user, isSelected, onSelect, onMouseDown }: UserListItemProps) {
  const isInactive = !user.is_active;
  
  return (
    <CommandItem
      value={`${user.name}-${user.id}`}
      onSelect={() => {
        // En selección múltiple, no queremos cerrar el popover automáticamente
        // Llamar a onSelect que manejará la selección
        onSelect();
      }}
      onMouseDown={onMouseDown}
      className={cn(
        "cursor-pointer",
        isSelected && "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50",
        isInactive && "opacity-50"
      )}
    >
      <div className="flex w-full items-center gap-2">
        <div className={cn(isInactive && "opacity-50")}>
          <UserAvatar picture={user.picture} name={user.name} size="md" />
        </div>
        <div className="flex-1">
          <span className={cn("font-medium", isInactive && "opacity-50")}>{user.name}</span>
          <div className={cn("text-xs text-muted-foreground", isInactive && "opacity-50")}>
            {user.agency?.name} - {user.role?.role}
          </div>
        </div>
        {isSelected && <Check className={cn("ml-2 h-4 w-4 shrink-0", isInactive && "opacity-50")} />}
      </div>
    </CommandItem>
  );
}
