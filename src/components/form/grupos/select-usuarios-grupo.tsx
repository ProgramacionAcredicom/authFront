import { useEffect, useMemo, useState, useRef } from "react";
import { Loader2, X, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { useInfiniteColaboradores } from "@/hooks/colaboradores/useInfiniteColaboradores";
import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryAgencias } from "@/hooks/agencias/useQueryAgencias";
import { useQueryRoles } from "@/hooks/roles/useQueryRoles";
import { useInView } from "react-intersection-observer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SelectUsuariosGrupoProps {
  selectedUsers: ColaboradorResult[];
  setSelectedUsers: (users: ColaboradorResult[]) => void;
  userIds?: number[];
  initialUsers?: ColaboradorResult[];
}

export const SelectUsuariosGrupo = ({ selectedUsers, setSelectedUsers, userIds, initialUsers }: SelectUsuariosGrupoProps) => {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [filterAgencia, setFilterAgencia] = useState<string>("all");
  const [filterPuesto, setFilterPuesto] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const initializedRef = useRef(false);
  const previousUserIdsRef = useRef<number[] | undefined>(undefined);
  const userHasModifiedRef = useRef(false);
  const keyStateRef = useRef({ metaKey: false, ctrlKey: false });

  const { queryAgencias } = useQueryAgencias();
  const { queryRoles } = useQueryRoles();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteColaboradores(searchFilter, {
    agencia: filterAgencia,
    puesto: filterPuesto,
  });

  const { ref, inView } = useInView();

  // Scroll infinito
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Capturar el estado de las teclas Cmd/Ctrl globalmente
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        keyStateRef.current = {
          metaKey: e.metaKey,
          ctrlKey: e.ctrlKey,
        };
      }
    };

    const handleKeyUp = () => {
      setTimeout(() => {
        keyStateRef.current = { metaKey: false, ctrlKey: false };
      }, 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Obtener todos los usuarios de todas las páginas
  const allUsers = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  // Filtrar usuarios por agencia y puesto localmente
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    if (filterAgencia && filterAgencia !== "all") {
      filtered = filtered.filter((user) => user.agency?.id.toString() === filterAgencia);
    }

    if (filterPuesto && filterPuesto !== "all") {
      filtered = filtered.filter((user) => user.role?.id.toString() === filterPuesto);
    }

    return filtered;
  }, [allUsers, filterAgencia, filterPuesto]);

  // Verificar si un usuario está seleccionado
  const isUserSelected = (userId: number) => {
    return selectedUsers.some((u) => u.id === userId);
  };

  // Manejar selección múltiple con Cmd/Ctrl
  const handleUserToggle = (user: ColaboradorResult, event?: React.MouseEvent | KeyboardEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const isSelected = isUserSelected(user.id);
    const isMultiSelect = event
      ? event.metaKey || event.ctrlKey
      : keyStateRef.current.metaKey || keyStateRef.current.ctrlKey;

    userHasModifiedRef.current = true;

    if (isSelected) {
      const newUsers = selectedUsers.filter((u) => u.id !== user.id);
      setSelectedUsers(newUsers);
      toast.success(`Usuario "${user.name}" eliminado`, {
        duration: 2000,
      });
      if (!isMultiSelect) {
        setOpen(false);
      }
    } else {
      if (isMultiSelect) {
        const newUsers = [...selectedUsers, user];
        setSelectedUsers(newUsers);
        toast.success(`Usuario "${user.name}" agregado`, {
          duration: 2000,
        });
      } else {
        const newUsers = [...selectedUsers, user];
        setSelectedUsers(newUsers);
        toast.success(`Usuario "${user.name}" agregado`, {
          duration: 2000,
        });
        setOpen(false);
      }
    }
  };

  // Inicializar usuarios seleccionados desde userIds o initialUsers
  useEffect(() => {
    if (userHasModifiedRef.current && initializedRef.current) {
      return;
    }

    const userIdsString = JSON.stringify(userIds?.sort() || []);
    const previousUserIdsString = JSON.stringify(previousUserIdsRef.current?.sort() || []);
    const userIdsChanged = userIdsString !== previousUserIdsString;

    if (!userIdsChanged && initializedRef.current) {
      return;
    }

    if (!userIds || userIds.length === 0) {
      if (userIdsChanged) {
        setSelectedUsers([]);
      }
      previousUserIdsRef.current = userIds;
      initializedRef.current = true;
      return;
    }

    // Priorizar initialUsers si están disponibles (tienen información completa como picture)
    if (initialUsers && initialUsers.length > 0) {
      if (userIdsChanged || !initializedRef.current) {
        // Filtrar initialUsers por los userIds que coinciden
        const initialSelected = initialUsers.filter((u) => userIds.includes(u.id));
        if (userIdsChanged) {
          setSelectedUsers(initialSelected);
          userHasModifiedRef.current = false;
        } else if (!initializedRef.current && !userHasModifiedRef.current) {
          setSelectedUsers(initialSelected);
        }
        initializedRef.current = true;
      }
      previousUserIdsRef.current = userIds;
    } else if (allUsers.length > 0) {
      // Fallback: buscar en allUsers si initialUsers no está disponible
      if (userIdsChanged || !initializedRef.current) {
        const initialSelected = allUsers.filter((u) => userIds.includes(u.id));
        if (userIdsChanged) {
          setSelectedUsers(initialSelected);
          userHasModifiedRef.current = false;
        } else if (!initializedRef.current && !userHasModifiedRef.current) {
          setSelectedUsers(initialSelected);
        }
        initializedRef.current = true;
      }
      previousUserIdsRef.current = userIds;
    }
  }, [userIds, allUsers, initialUsers, setSelectedUsers]);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex flex-col gap-2">
        <TypographyH3 text="Usuarios asignados" className="text-custom-foreground text-lg font-semibold" />
        <Separator />
      </div>
      <div className="flex items-center gap-4 justify-between">
        <Popover open={open} onOpenChange={setOpen} modal={true}>
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
            className="w-[var(--radix-popover-trigger-width)] p-0 z-[100]" 
            align="start" 
            side="bottom"
            onWheel={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div 
              onWheel={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
            >
              <Command shouldFilter={false}>
                <div className="flex flex-col gap-2 p-2 border-b">
                  <CommandInput
                    placeholder="Buscar por nombre..."
                    value={searchFilter}
                    onValueChange={setSearchFilter}
                  />
                  <div className="flex gap-2">
                    <Select value={filterAgencia} onValueChange={setFilterAgencia}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Filtrar por agencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las agencias</SelectItem>
                        {queryAgencias.data?.map((agencia) => (
                          <SelectItem key={agencia.id} value={agencia.id.toString()}>
                            {agencia.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterPuesto} onValueChange={setFilterPuesto}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Filtrar por puesto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los puestos</SelectItem>
                        {queryRoles.data?.map((rol) => (
                          <SelectItem key={rol.id} value={rol.id.toString()}>
                            {rol.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CommandList 
                  className="h-[300px] max-h-[300px]"
                  onWheel={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                  onTouchMove={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                >
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
                <CommandGroup>
                  {filteredUsers.map((user) => {
                    const isSelected = isUserSelected(user.id);
                    return (
                      <CommandItem
                        key={user.id}
                        value={`${user.name}-${user.id}`}
                        onSelect={() => {
                          handleUserToggle(user);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          keyStateRef.current = {
                            metaKey: e.metaKey,
                            ctrlKey: e.ctrlKey,
                          };
                        }}
                        className={cn(
                          "cursor-pointer",
                          isSelected && "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50"
                        )}
                      >
                        <div className="flex w-full items-center gap-2">
                          <Avatar className="h-6 w-6">
                            {user.picture ? (
                              <AvatarImage src={user.picture} alt={user.name} />
                            ) : (
                              <AvatarFallback className="text-xs">
                                {user.name
                                  ? user.name
                                      .split(" ")
                                      .slice(0, 2)
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
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
                  })}
                </CommandGroup>
                <div ref={ref} className="py-2">
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Cargando más...</span>
                    </div>
                  )}
                </div>
              </CommandList>
            </Command>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex min-h-32 max-h-64 flex-col gap-3 overflow-y-auto rounded-3xl border border-neutral-200 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 shadow-sm">
        {selectedUsers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <Badge
                key={user.id}
                variant="secondary"
                className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-600 border border-neutral-200 dark:border-neutral-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-default"
              >
                <Avatar className="h-5 w-5 border border-gray-200 dark:border-gray-600">
                  {user.picture ? (
                    <AvatarImage src={user.picture} alt={user.name} />
                  ) : (
                    <AvatarFallback className="text-xs border border-gray-200 dark:border-gray-600">
                      {user.name
                        ? user.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    userHasModifiedRef.current = true;
                    const newUsers = selectedUsers.filter((u) => u.id !== user.id);
                    setSelectedUsers(newUsers);
                    toast.success(`Usuario "${user.name}" eliminado`, {
                      duration: 2000,
                    });
                  }}
                  className="h-5 w-5 p-0 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Eliminar usuario ${user.name}`}
                >
                  <X className="h-3 w-3 text-red-600" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-32 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50">
            <div className="flex flex-col items-center gap-2 text-center">
              <TypographyMuted text="No hay usuarios seleccionados" className="text-base" />
              <TypographyMuted text="Usa el selector arriba para agregar usuarios. Usa Cmd/Ctrl para selección múltiple." className="text-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

