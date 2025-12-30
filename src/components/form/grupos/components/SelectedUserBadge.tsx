import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";
import { UserAvatar } from "./UserAvatar";
import { cn } from "@/lib/utils";

interface SelectedUserBadgeProps {
  user: ColaboradorResult;
  onRemove: () => void;
}

/**
 * Componente para mostrar un usuario seleccionado como badge
 */
export function SelectedUserBadge({ user, onRemove }: SelectedUserBadgeProps) {
  const isInactive = !user.is_active;
  
  return (
    <Badge
      variant="secondary"
      className={cn(
        "group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-600 border border-neutral-200 dark:border-neutral-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-default",
        isInactive && "opacity-50"
      )}
    >
      <div className={cn(isInactive && "opacity-50")}>
        <UserAvatar picture={user.picture} name={user.name} size="sm" />
      </div>
      <span className={cn("text-sm font-medium", isInactive && "opacity-50")}>{user.name}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className={cn(
          "h-5 w-5 p-0 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
          isInactive && "opacity-30"
        )}
        aria-label={`Eliminar usuario ${user.name}`}
      >
        <X className="h-3 w-3 text-red-600" />
      </Button>
    </Badge>
  );
}

