import { useEffect, useMemo, useState, useRef } from "react";
import { Loader2, X, ChevronDown, ChevronUp, Plus, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { useQueryGruposSinPaginacion } from "@/hooks/grupos/useQueryGrupos";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface GruposSeleccionadosProps {
  selectedGroups: GruposTypeModel[];
  setSelectedGroups: (groups: GruposTypeModel[]) => void;
  groupIds?: number[];
  fallbackGroups?: GruposTypeModel[];
  collaboratorKey?: number | string;
  onManualSelectionChange?: (hasModified: boolean) => void;
}

export const GruposSeleccionados = ({
  selectedGroups,
  setSelectedGroups,
  groupIds,
  fallbackGroups = [],
  collaboratorKey,
  onManualSelectionChange,
}: GruposSeleccionadosProps) => {
  const { queryGruposSinPaginacion } = useQueryGruposSinPaginacion();
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [expandedAplicativos, setExpandedAplicativos] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const initializedRef = useRef(false);
  const previousGroupIdsRef = useRef("[]");
  const previousCollaboratorKeyRef = useRef<number | string | undefined>(collaboratorKey);
  const userHasModifiedRef = useRef(false);
  const keyStateRef = useRef({ metaKey: false, ctrlKey: false });

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
      // Resetear después de un pequeño delay para permitir que el click se procese
      setTimeout(() => {
        keyStateRef.current = { metaKey: false, ctrlKey: false };
      }, 100);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey) {
        keyStateRef.current = {
          metaKey: e.metaKey,
          ctrlKey: e.ctrlKey,
        };
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Ordenar grupos por aplicativos (por nombre del primer aplicativo)
  const sortedGroups = useMemo(() => {
    if (!queryGruposSinPaginacion.data) return [];
    return [...queryGruposSinPaginacion.data].sort((a, b) => {
      const aAplicativo = a.aplicativos?.[0]?.nombre || "";
      const bAplicativo = b.aplicativos?.[0]?.nombre || "";
      if (aAplicativo !== bAplicativo) {
        return aAplicativo.localeCompare(bAplicativo);
      }
      return a.nombre.localeCompare(b.nombre);
    });
  }, [queryGruposSinPaginacion.data]);

  // Filtrar grupos por búsqueda (nombre de grupo o nombre de aplicativo)
  const filteredGroups = useMemo(() => {
    if (!searchFilter.trim()) return sortedGroups;
    const searchLower = searchFilter.toLowerCase();
    return sortedGroups.filter((g) => {
      const nombreMatch = g.nombre.toLowerCase().includes(searchLower);
      const aplicativoMatch = g.aplicativos?.some((aplicativo: { nombre: string }) =>
        aplicativo.nombre.toLowerCase().includes(searchLower)
      );
      return nombreMatch || aplicativoMatch;
    });
  }, [sortedGroups, searchFilter]);

  // Verificar si un grupo está seleccionado
  const isGroupSelected = (groupId: number) => {
    return selectedGroups.some((g) => g.id === groupId);
  };

  const markManualSelectionChange = () => {
    userHasModifiedRef.current = true;
    onManualSelectionChange?.(true);
  };

  // Manejar selección múltiple con Cmd/Ctrl
  const handleGroupToggle = (groupId: number, event?: React.MouseEvent | KeyboardEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const group = sortedGroups.find((g) => g.id === groupId);
    if (!group) return;

    const isSelected = isGroupSelected(groupId);
    // Usar el estado de las teclas capturado o del evento
    const isMultiSelect = event
      ? (event.metaKey || event.ctrlKey)
      : (keyStateRef.current.metaKey || keyStateRef.current.ctrlKey);

    // Marcar que el usuario ha modificado los grupos
    markManualSelectionChange();

    if (isSelected) {
      // Si está seleccionado, quitarlo (siempre se puede quitar)
      const newGroups = selectedGroups.filter((g: GruposTypeModel) => g.id !== groupId);
      setSelectedGroups(newGroups);
      toast.success(`Grupo "${group.nombre}" eliminado`, {
        duration: 2000,
      });
      // Si no hay Cmd/Ctrl, cerrar el popover
      if (!isMultiSelect) {
        setOpen(false);
      }
    } else {
      // Si no está seleccionado
      // Verificar que no esté ya seleccionado
      if (selectedGroups.some((g: GruposTypeModel) => g.id === groupId)) {
        return;
      }

      if (isMultiSelect) {
        // Con Cmd/Ctrl: agregar a la selección existente (mantener popover abierto)
        const newGroups = [...selectedGroups, group];
        setSelectedGroups(newGroups);
        toast.success(`Grupo "${group.nombre}" agregado`, {
          duration: 2000,
        });
      } else {
        // Sin Cmd/Ctrl: agregar el grupo y cerrar el popover
        const newGroups = [...selectedGroups, group];
        setSelectedGroups(newGroups);
        toast.success(`Grupo "${group.nombre}" agregado`, {
          duration: 2000,
        });
        setOpen(false);
      }
    }
  };

  // Inicializar grupos seleccionados desde groupIds solo cuando cambian los groupIds (nuevo usuario)
  useEffect(() => {
    const normalizedGroupIds = [...(groupIds ?? [])].sort((a, b) => a - b);
    const groupIdsString = JSON.stringify(normalizedGroupIds);
    const collaboratorChanged = previousCollaboratorKeyRef.current !== collaboratorKey;
    const groupIdsChanged = groupIdsString !== previousGroupIdsRef.current;
    const shouldForceHydrate = collaboratorChanged || groupIdsChanged || !initializedRef.current;

    if (!shouldForceHydrate && userHasModifiedRef.current && initializedRef.current) {
      return;
    }

    if (!shouldForceHydrate) {
      return;
    }

    if (normalizedGroupIds.length === 0) {
      setSelectedGroups([]);
      setExpandedAplicativos(new Set());
      previousGroupIdsRef.current = groupIdsString;
      previousCollaboratorKeyRef.current = collaboratorKey;
      userHasModifiedRef.current = false;
      onManualSelectionChange?.(false);
      initializedRef.current = true;
      return;
    }

    const catalogGroups = queryGruposSinPaginacion.data ?? [];
    const catalogById = new Map(catalogGroups.map((group) => [group.id, group] as const));
    const fallbackById = new Map(fallbackGroups.map((group) => [group.id, group] as const));

    const initialSelected = normalizedGroupIds
      .map((groupId) => catalogById.get(groupId) ?? fallbackById.get(groupId))
      .filter((group): group is GruposTypeModel => Boolean(group));

    if (initialSelected.length === 0 && catalogGroups.length === 0 && fallbackGroups.length === 0) {
      return;
    }

    setSelectedGroups(initialSelected);

    const aplicativosWithGroups = new Set<string>();
    initialSelected.forEach((group: GruposTypeModel) => {
      const aplicativoKey = group.aplicativos?.[0]?.nombre || "Sin aplicativo";
      aplicativosWithGroups.add(aplicativoKey);
    });
    setExpandedAplicativos(aplicativosWithGroups);

    previousGroupIdsRef.current = groupIdsString;
    previousCollaboratorKeyRef.current = collaboratorKey;
    userHasModifiedRef.current = false;
    onManualSelectionChange?.(false);
    initializedRef.current = true;
  }, [collaboratorKey, fallbackGroups, groupIds, queryGruposSinPaginacion.data, setSelectedGroups]);

  // Agrupar grupos por aplicativo para el Command
  const groupedByAplicativo = useMemo(() => {
    const groups = new Map<string, GruposTypeModel[]>();
    filteredGroups.forEach((group) => {
      const aplicativoKey = group.aplicativos?.[0]?.nombre || "Sin aplicativo";
      if (!groups.has(aplicativoKey)) {
        groups.set(aplicativoKey, []);
      }
      groups.get(aplicativoKey)!.push(group);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredGroups]);

  // Agrupar y ordenar grupos seleccionados por aplicativo
  const groupedSelectedGroups = useMemo(() => {
    // Crear un mapa para agrupar por aplicativo
    const groupsByAplicativo = new Map<string, GruposTypeModel[]>();

    selectedGroups.forEach((group) => {
      // Si el grupo tiene aplicativos, usar el primer aplicativo como clave
      // Si no tiene aplicativos, usar "Sin aplicativo"
      const aplicativoKey = group.aplicativos?.[0]?.nombre || "Sin aplicativo";

      if (!groupsByAplicativo.has(aplicativoKey)) {
        groupsByAplicativo.set(aplicativoKey, []);
      }
      groupsByAplicativo.get(aplicativoKey)!.push(group);
    });

    // Ordenar grupos dentro de cada aplicativo por nombre
    groupsByAplicativo.forEach((groups) => {
      groups.sort((a, b) => a.nombre.localeCompare(b.nombre));
    });

    // Convertir a array y ordenar por nombre de aplicativo
    return Array.from(groupsByAplicativo.entries())
      .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
      .map(([aplicativo, groups]) => ({ aplicativo, groups }));
  }, [selectedGroups]);

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex flex-col gap-2">
        <TypographyH3 text="Grupos y permisos" className="text-custom-foreground text-lg font-semibold" />
        <Separator />
      </div>
      <div className="flex items-center md:gap-24 gap-4 justify-between">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between rounded-full bg-background dark:bg-neutral-900 font-normal"
            >
              <span className="truncate">
                {selectedGroups.length > 0
                  ? `${selectedGroups.length} grupo(s) seleccionado(s)`
                  : "Seleccionar grupos..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" side="bottom">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Buscar por nombre de grupo o aplicativo..."
                value={searchFilter}
                onValueChange={setSearchFilter}
              />
              <CommandList className="h-[200px] max-h-[200px]">
                <CommandEmpty>
                  {queryGruposSinPaginacion.isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <TypographyMuted text="Cargando..." />
                    </div>
                  ) : (
                    <TypographyMuted text="No se encontraron grupos" className="py-6 text-center" />
                  )}
                </CommandEmpty>
                {groupedByAplicativo.map(([aplicativo, groups]) => (
                  <CommandGroup key={aplicativo} heading={aplicativo}>
                    {groups.map((group) => {
                      const isSelected = isGroupSelected(group.id);
                      return (
                        <CommandItem
                          key={group.id}
                          value={`${group.nombre}-${aplicativo}`}
                          onSelect={() => {
                            // Usar onSelect que es el evento principal de CommandItem
                            // Prevenir el comportamiento por defecto del Command
                            handleGroupToggle(group.id);
                          }}
                          onMouseDown={(e) => {
                            // Capturar el estado de las teclas antes del click
                            e.stopPropagation();
                            keyStateRef.current = {
                              metaKey: e.metaKey,
                              ctrlKey: e.ctrlKey,
                            };
                          }}
                          onKeyDown={(e) => {
                            // Capturar el estado de las teclas para navegación con teclado
                            keyStateRef.current = {
                              metaKey: e.metaKey,
                              ctrlKey: e.ctrlKey,
                            };
                          }}
                          onClick={(e) => {
                            // También manejar onClick como respaldo
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className={cn(
                            "cursor-pointer",
                            isSelected && "bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50"
                          )}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="font-medium">{group.nombre}</span>
                            {isSelected && <Check className="ml-2 h-4 w-4 shrink-0" />}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedGroups.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const allExpanded = groupedSelectedGroups.every(({ aplicativo }) => expandedAplicativos.has(aplicativo));
              if (allExpanded) {
                setExpandedAplicativos(new Set());
              } else {
                const allAplicativos = new Set(groupedSelectedGroups.map(({ aplicativo }) => aplicativo));
                setExpandedAplicativos(allAplicativos);
              }
            }}
            className="gap-2"
          >
            {groupedSelectedGroups.every(({ aplicativo }) => expandedAplicativos.has(aplicativo)) ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Colapsar todo
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expandir todo
              </>
            )}
          </Button>
        )}
      </div>
      <div className="flex min-h-64 max-h-96 flex-col gap-3 overflow-y-auto rounded-3xl border border-neutral-200 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 shadow-sm">
        {groupedSelectedGroups.length > 0 ? (
          groupedSelectedGroups.map(({ aplicativo, groups }) => {
            const isOpen = expandedAplicativos.has(aplicativo);
            return (
              <Collapsible
                key={aplicativo}
                open={isOpen}
                onOpenChange={(open) => {
                  setExpandedAplicativos((prev) => {
                    const newSet = new Set(prev);
                    if (open) {
                      newSet.add(aplicativo);
                    } else {
                      newSet.delete(aplicativo);
                    }
                    return newSet;
                  });
                }}
              >
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <TypographyH3 text={aplicativo} className="text-custom-gray text-sm font-semibold dark:text-neutral-400" />
                        <Badge variant="secondary" className="text-xs">
                          {groups.length}
                        </Badge>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-neutral-600" /> : <ChevronDown className="h-4 w-4 text-neutral-600" />}
                    </Button>
                  </CollapsibleTrigger>
                  <Button type="button" variant="ghost" size="sm" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    markManualSelectionChange();
                    const newGroups = selectedGroups.filter((g: GruposTypeModel) => !groups.includes(g));
                    setSelectedGroups(newGroups);
                    toast.success(`Grupos del aplicativo "${aplicativo}" eliminados`, {
                      duration: 2000,
                    });
                  }}>
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
                <CollapsibleContent className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {groups.map((group) => (
                      <Badge
                        key={group.id}
                        variant="secondary"
                        className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-600 border border-neutral-200 dark:border-neutral-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-default"
                      >
                        <span className="text-sm font-medium">{group.nombre}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            markManualSelectionChange();
                            const newGroups = selectedGroups.filter((g: GruposTypeModel) => g.id !== group.id);
                            setSelectedGroups(newGroups);
                            toast.success(`Grupo "${group.nombre}" eliminado`, {
                              duration: 2000,
                            });
                          }}
                          className="h-5 w-5 p-0 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Eliminar grupo ${group.nombre}`}
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        ) : (
          <div className="flex h-full min-h-64 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-neutral-200 p-3">
                <Plus className="h-6 w-6 text-neutral-500" />
              </div>
              <TypographyMuted text="No hay grupos seleccionados" className="text-base" />
              <TypographyMuted text="Usa el selector arriba para agregar grupos. Usa Cmd/Ctrl para selección múltiple." className="text-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
