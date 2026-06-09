"use client";

import * as React from "react";
import { Briefcase, Building2, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

import type { MiAccesoCollaborator } from "./mi-acceso.types";
import { mapCollaboratorToMiAccesoCollaborator } from "./mi-acceso.utils";
import { useHasPermission } from "@/hooks/auth/usePermissionAccess";
import { useInfiniteColaboradores } from "@/hooks/colaboradores/useInfiniteColaboradores";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";
import { cn } from "@/lib/utils";

interface MiAccesoCollaboratorSelectProps {
  id?: string;
  value: MiAccesoCollaborator | null;
  onChange: (value: MiAccesoCollaborator | null) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export function MiAccesoCollaboratorSelect({
  id,
  value,
  onChange,
  placeholder = "Seleccionar colaborador",
  className,
  ariaLabel,
}: MiAccesoCollaboratorSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const selectedLabel = value?.name ?? "";
  const { ref, inView } = useInView();
  const { hasPermission: canListUsers } = useHasPermission(OAUTH_PERMISSIONS.LIST_USERS);

  const updateDebouncedSearch = useDebouncedCallback((nextValue: string) => {
    setDebouncedSearch(nextValue.trim());
  }, 250);

  React.useEffect(() => {
    updateDebouncedSearch(search);
  }, [search, updateDebouncedSearch]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteColaboradores(debouncedSearch, undefined, { enabled: open && canListUsers });

  const results = React.useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);
  const activeResults = React.useMemo(() => results.filter((collaborator) => collaborator.is_active), [results]);

  React.useEffect(() => {
    if (inView && open && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
      setDebouncedSearch("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={open}
          disabled={!canListUsers}
          className={cn("w-full justify-between font-normal", !selectedLabel && "text-muted-foreground", className)}
        >
          <span className={cn("truncate", value?.isActive === false && "text-muted-foreground")}>
            {selectedLabel || (canListUsers ? placeholder : "Sin permiso para listar colaboradores")}
          </span>
          <ChevronsUpDown aria-hidden="true" className="shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Buscar por nombre o usuario..." value={search} onValueChange={setSearch} />
          <CommandList className="max-h-[320px]">
            {!canListUsers ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">No tienes permisos para listar colaboradores.</div>
            ) : isLoading ? (
              <div className="flex items-center justify-center px-3 py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Buscando colaboradores...
              </div>
            ) : isError ? (
              <div className="px-3 py-6 text-center text-sm text-destructive">No se pudo cargar la búsqueda de colaboradores.</div>
            ) : (
              <>
                <CommandEmpty>No se encontraron colaboradores.</CommandEmpty>
                <CommandGroup>
                  {activeResults.map((collaborator) => {
                    const collaboratorValue = mapCollaboratorToMiAccesoCollaborator(collaborator);
                    const isSelected = value?.id === collaboratorValue.id;

                    return (
                      <CommandItem
                        key={collaborator.id}
                        value={`${collaborator.name} ${collaborator.username} ${collaborator.role?.role ?? ""} ${collaborator.agency?.name ?? ""}`}
                        onSelect={() => {
                          onChange(collaboratorValue);
                          setOpen(false);
                        }}
                        className="items-center gap-3 py-3"
                      >
                        <Check aria-hidden="true" className={cn("mt-0.5 shrink-0 opacity-0", isSelected && "opacity-100")} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{collaborator.name}</p>
                          <p className="truncate text-xs lowercase text-muted-foreground">@{collaborator.username}</p>
                          <div className="mt-1 flex flex-col items-start gap-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase aria-hidden="true" className="size-3.5 opacity-60" />
                              {collaborator.role?.role ?? "Sin puesto"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 aria-hidden="true" className="size-3.5 opacity-60" />
                              {collaborator.agency?.name ?? "Sin agencia"}
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <div ref={ref} className="px-3 py-2">
                  {isFetchingNextPage ? (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Cargando más colaboradores...
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
