import { UIEvent, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Search, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useInfiniteColaboradores } from "@/hooks/colaboradores/useInfiniteColaboradores";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { ColaboradorListItem } from "./colaborador-list-item";

interface ColaboradorListPanelProps {
  activeId?: number;
  onItemSelected?: () => void;
  className?: string;
}

export const ColaboradorListPanel = ({ activeId, onItemSelected, className }: ColaboradorListPanelProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(querySearch);
  const deferredSearch = useDeferredValue(search);
  const debouncedSearch = useDebouncedCallback((value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    const trimmed = value.trim();

    if (trimmed) nextParams.set("q", trimmed);
    else nextParams.delete("q");

    const nextString = nextParams.toString();
    const currentString = searchParams.toString();
    if (nextString !== currentString) {
      setSearchParams(nextParams, { replace: true });
    }
  }, 300);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteColaboradores(deferredSearch);

  useEffect(() => {
    // Sincroniza el input si la URL cambia (back/forward o recarga con q)
    setSearch(querySearch);
  }, [querySearch]);

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  const colaboradores = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;

    const target = event.currentTarget;
    const remaining = target.scrollHeight - target.scrollTop - target.clientHeight;

    if (remaining < 160) {
      fetchNextPage();
    }
  };

  const handleSelect = (id: number) => {
    if (id === activeId) {
      onItemSelected?.();
      return;
    }

    const q = search.trim();
    navigate(`/colaboradores/editar/${id}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    onItemSelected?.();
  };

  return (
    <aside className={className}>
      <div className="flex h-full min-h-0 flex-col rounded-2xl border bg-white p-3 shadow-sm dark:bg-neutral-950">
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <Users className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Colaboradores</p>
            <p className="text-xs text-muted-foreground">{colaboradores.length} cargados</p>
          </div>
        </div>

        <div className="mb-3">
          <Input
            aria-label="Buscar colaborador"
            placeholder="Buscar por nombre o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<Search className="size-4" />}
            className="h-10 rounded-xl"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1" onScroll={handleListScroll}>
          <div className="space-y-2 pb-2">
            {isLoading && colaboradores.length === 0 && (
              <div className="flex items-center justify-center rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Cargando colaboradores...
              </div>
            )}

            {isError && !isLoading && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                No se pudo cargar la lista de colaboradores.
              </div>
            )}

            {!isLoading && !isError && colaboradores.length === 0 && (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                No se encontraron colaboradores con ese criterio.
              </div>
            )}

            {colaboradores.map((colaborador) => (
              <ColaboradorListItem
                key={colaborador.id}
                colaborador={colaborador}
                isActive={colaborador.id === activeId}
                onSelect={handleSelect}
              />
            ))}

            {isFetchingNextPage && (
              <div className="flex items-center justify-center rounded-xl border border-dashed p-3 text-xs text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" />
                Cargando más colaboradores...
              </div>
            )}

            {!hasNextPage && colaboradores.length > 0 && (
              <p className="py-2 text-center text-xs text-muted-foreground">No hay más colaboradores</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
