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
  return (
    <CommandItem
      value={`${user.name}-${user.id}`}
      onSelect={onSelect}
      onMouseDown={onMouseDown}
      className={cn(
        "cursor-pointer",
        isSelected && "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50"
      )}
    >
      <div className="flex w-full items-center gap-2">
        <UserAvatar picture={user.picture} name={user.name} size="md" />
        <div className="flex-1">
          <span className="font-medium">{user.name}</span>
          <div className="text-xs text-muted-foreground">
            {user.agency?.name} - {user.role?.role}
          </div>
        </div>
        {isSelected && <Check className="ml-2 h-4 w-4 shrink-0" />}
      </div>
    </CommandItem>
  );
}

