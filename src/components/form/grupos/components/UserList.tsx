import { Loader2 } from "lucide-react";
import { CommandEmpty, CommandGroup, CommandList } from "@/components/ui/command";
import { TypographyMuted } from "@/components/ui/typography";
import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";
import { UserListItem } from "./UserListItem";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

interface UserListProps {
  users: ColaboradorResult[];
  selectedUserIds: number[];
  onUserToggle: (user: ColaboradorResult, isMultiSelect: boolean) => void;
  isFetchingNextPage: boolean;
  scrollRef: (node: Element | null) => void;
}

/**
 * Componente para la lista de usuarios con scroll infinito
 */
export function UserList({
  users,
  selectedUserIds,
  onUserToggle,
  isFetchingNextPage,
  scrollRef,
}: UserListProps) {
  const { isMultiSelectKeyPressed, updateKeyState } = useKeyboardShortcuts();

  const isUserSelected = (userId: number) => selectedUserIds.includes(userId);

  const handleUserSelect = (user: ColaboradorResult) => {
    const isMultiSelect = isMultiSelectKeyPressed();
    onUserToggle(user, isMultiSelect);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateKeyState(e);
  };

  return (
    <CommandList className="h-[150px] max-h-[150px] overflow-y-auto">
      <CommandEmpty>
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center gap-2 py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <TypographyMuted text="Cargando..." />
          </div>
        ) : (
          <TypographyMuted text="No se encontraron usuarios" className="py-6 text-center" />
        )}
      </CommandEmpty>
      {users.length > 0 && (
        <CommandGroup>
          {users.map((user) => (
            <UserListItem
              key={user.id}
              user={user}
              isSelected={isUserSelected(user.id)}
              onSelect={() => handleUserSelect(user)}
              onMouseDown={handleMouseDown}
            />
          ))}
        </CommandGroup>
      )}
      <div ref={scrollRef} className="py-2">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Cargando más...</span>
          </div>
        )}
      </div>
    </CommandList>
  );
}

