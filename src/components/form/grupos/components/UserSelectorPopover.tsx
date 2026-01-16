import { useState, useRef } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput } from "@/components/ui/command";
import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";
import { UserFilters } from "./UserFilters";
import { UserList } from "./UserList";

interface UserSelectorPopoverProps {
  selectedUsers: ColaboradorResult[];
  searchFilter: string;
  onSearchChange: (value: string) => void;
  filterAgencia: string;
  filterPuesto: string;
  onAgenciaChange: (value: string) => void;
  onPuestoChange: (value: string) => void;
  filteredUsers: ColaboradorResult[];
  selectedUserIds: number[];
  onUserToggle: (user: ColaboradorResult, isMultiSelect: boolean) => void;
  isFetchingNextPage: boolean;
  scrollRef: (node: Element | null) => void;
  hideFilters?: boolean;
}

/**
 * Componente para el popover de selección de usuarios
 */
export function UserSelectorPopover({
  selectedUsers,
  searchFilter,
  onSearchChange,
  filterAgencia,
  filterPuesto,
  onAgenciaChange,
  onPuestoChange,
  filteredUsers,
  selectedUserIds,
  onUserToggle,
  isFetchingNextPage,
  scrollRef,
  hideFilters = false,
}: UserSelectorPopoverProps) {
  const [open, setOpen] = useState(false);
  const isSelectingRef = useRef(false);

  const handleUserToggle = (user: ColaboradorResult, isMultiSelect: boolean) => {
    // Marcar que estamos seleccionando para prevenir cierre automático
    isSelectingRef.current = true;
    onUserToggle(user, isMultiSelect);
    // Resetear el flag después de un pequeño delay
    setTimeout(() => {
      isSelectingRef.current = false;
    }, 200);
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Si estamos seleccionando un item, no cerrar el popover
    if (!newOpen && isSelectingRef.current) {
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-full bg-background dark:bg-neutral-900 font-normal"
        >
          <span className="truncate">
            {selectedUsers.length > 0 ? `${selectedUsers.length} usuario(s) seleccionado(s)` : "Seleccionar usuarios..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        side="bottom"
      >
        <Command shouldFilter={false}>
          <div className="flex flex-col gap-2 p-2 border-b">
            <CommandInput 
              placeholder="Buscar por nombre..." 
              value={searchFilter} 
              onValueChange={onSearchChange}
            />
            {!hideFilters && (
              <UserFilters
                filterAgencia={filterAgencia}
                filterPuesto={filterPuesto}
                onAgenciaChange={onAgenciaChange}
                onPuestoChange={onPuestoChange}
              />
            )}
          </div>
          <UserList
            users={filteredUsers}
            selectedUserIds={selectedUserIds}
            onUserToggle={handleUserToggle}
            isFetchingNextPage={isFetchingNextPage}
            scrollRef={scrollRef}
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
