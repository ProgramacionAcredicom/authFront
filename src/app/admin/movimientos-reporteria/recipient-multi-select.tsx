"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";
import { useHasPermission } from "@/hooks/auth/usePermissionAccess";
import { useInfiniteColaboradores } from "@/hooks/colaboradores/useInfiniteColaboradores";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { UserAvatar } from "@/components/form/grupos/components/UserAvatar";
import { cn } from "@/lib/utils";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

interface RecipientMultiSelectProps {
  selectedRecipients: CollaboratorResult[];
  onChange: (value: CollaboratorResult[]) => void;
}

export function RecipientMultiSelect({ selectedRecipients, onChange }: RecipientMultiSelectProps) {
  const anchor = useComboboxAnchor();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const { hasPermission: canListUsers } = useHasPermission(OAUTH_PERMISSIONS.LIST_USERS);

  const updateDebouncedSearch = useDebouncedCallback((nextValue: string) => {
    setDebouncedSearch(nextValue.trim());
  }, 250);

  React.useEffect(() => {
    updateDebouncedSearch(search);
  }, [search, updateDebouncedSearch]);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteColaboradores(
    debouncedSearch,
    undefined,
    { enabled: open && canListUsers },
  );

  const results = React.useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);
  const activeResults = React.useMemo(() => results.filter((recipient) => recipient.is_active), [results]);

  const items = React.useMemo(() => {
    const recipientsById = new Map<number, CollaboratorResult>();

    selectedRecipients.forEach((recipient) => {
      recipientsById.set(recipient.id, recipient);
    });

    activeResults.forEach((recipient) => {
      recipientsById.set(recipient.id, recipient);
    });

    return Array.from(recipientsById.values());
  }, [activeResults, selectedRecipients]);

  const filterRecipient = React.useCallback((recipient: CollaboratorResult, query: string) => {
    if (!recipient.is_active) {
      return false;
    }

    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [recipient.name, recipient.username, recipient.email ?? ""].join(" ").toLowerCase().includes(normalizedQuery);
  }, []);

  if (!canListUsers) {
    return (
      <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
        No tienes permisos para listar colaboradores destinatarios.
      </div>
    );
  }

  return (
    <Combobox
      multiple
      autoHighlight
      modal={false}
      open={open}
      onOpenChange={setOpen}
      items={items}
      value={selectedRecipients}
      onValueChange={(value) => onChange(Array.isArray(value) ? value : [])}
      inputValue={search}
      onInputValueChange={setSearch}
      filter={filterRecipient}
      isItemEqualToValue={(item, value) => item.id === value.id}
      itemToStringLabel={(item) => item.name}
      itemToStringValue={(item) => String(item.id)}
    >
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {(values) => (
            <>
              {values.map((recipient: CollaboratorResult) => (
                <ComboboxChip key={recipient.id} className={cn(!recipient.is_active && "opacity-60")}>
                  <UserAvatar picture={recipient.picture} name={recipient.name} size="sm" />
                  <span className="max-w-44 truncate">{recipient.name}</span>
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                aria-label="Seleccionar colaboradores destinatarios"
                placeholder={values.length === 0 ? "Selecciona colaboradores" : "Buscar colaborador..."}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor} className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center px-3 py-6 text-sm text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Buscando colaboradores...
          </div>
        ) : isError ? (
          <div className="px-3 py-6 text-center text-sm text-destructive">
            No se pudo cargar la búsqueda de colaboradores.
          </div>
        ) : (
          <>
            <ComboboxEmpty>No se encontraron colaboradores.</ComboboxEmpty>
            <ComboboxList>
              {(collaborator: CollaboratorResult) => (
                <ComboboxItem key={collaborator.id} value={collaborator} className="items-center gap-3 py-3 pr-8">
                  <div className="shrink-0">
                    <UserAvatar picture={collaborator.picture} name={collaborator.name} size="md" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{collaborator.name}</p>
                    <p className="truncate text-xs text-muted-foreground lowercase">@{collaborator.username}</p>
                    <p className="truncate text-xs text-muted-foreground">{collaborator.email}</p>
                  </div>
                </ComboboxItem>
              )}
            </ComboboxList>
            {hasNextPage ? (
              <div className="border-t p-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 data-icon="inline-start" className="animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    "Cargar más"
                  )}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
