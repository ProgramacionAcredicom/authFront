import { useState, useMemo, useEffect } from "react";
import { useInfiniteGrupos } from "@/hooks/grupos/useInfiniteGrupos";
import { ModalAgregarGrupo } from "@/components/modal/grupos/modal-agregar-grupo";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { CardGrupos } from "@/components/ui/cardGrupos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, Users, Inbox, Filter, ArrowUpDown } from "lucide-react";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { localGruposMapper } from "@/mappers/local-grupos.mapper";
import { useInView } from "react-intersection-observer";
import { SortOption, FilterOption } from "@/hooks/grupos/useInfiniteGrupos";

export default function TabGrupos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("nombre-asc");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const { data: infiniteData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteGrupos(searchTerm, filterBy, sortBy);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px", // Cargar cuando el elemento esté a 100px de ser visible
  });

  // Scroll infinito: cargar más cuando el elemento de referencia está visible
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Mapear todos los resultados de todas las páginas (ya vienen filtrados y ordenados del backend)
  const data = useMemo((): GruposTypeModel[] => {
    if (!infiniteData?.pages) return [];
    return infiniteData.pages.flatMap((page) => 
      page.results.map((grupo) => localGruposMapper(grupo))
    );
  }, [infiniteData]);

  // Calcular total de items
  const totalItems = infiniteData?.pages[0]?.total ?? 0;

  // Resetear búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };


  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      <header className="flex items-center justify-between">
        <div>
          <TypographyH3 text="Grupos" className="text-custom-gray" />
          <TypographyMuted text="Gestiona los grupos del sistema" />
        </div>
        <ModalAgregarGrupo />
      </header>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Buscar por grupo o usuario..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  aria-label="Limpiar búsqueda"
                >
                  <span className="sr-only">Limpiar</span>
                  ×
                </Button>
              )}
            </div>
          </div>
          {data.length > 0 && totalItems > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {data.length} de {totalItems} grupo{totalItems !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Filtros y ordenamiento */}
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtros:</span>
            </div>
            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ordenar:</span>
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nombre-asc">Nombre (A-Z)</SelectItem>
                <SelectItem value="nombre-desc">Nombre (Z-A)</SelectItem>
                <SelectItem value="created_on-asc">Fecha creación (Más antiguo)</SelectItem>
                <SelectItem value="created_on-desc">Fecha creación (Más reciente)</SelectItem>
              </SelectContent>
            </Select>
            {(filterBy !== "all" || sortBy !== "nombre-asc") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterBy("all");
                  setSortBy("nombre-asc");
                }}
                className="h-9"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
      </div>

      {/* Contenido - Scroll infinito */}
      {isLoading && data.length === 0 ? (
        // Estado inicial de carga (primera vez)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data.length === 0 && !isLoading ? (
        // Estado vacío mejorado
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-muted p-4 mb-4">
              {searchTerm ? (
                <Search className="h-8 w-8 text-muted-foreground" />
              ) : (
                <Inbox className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <TypographyH3 
              text={searchTerm ? "No se encontraron grupos" : "No hay grupos disponibles"} 
              className="mb-2 text-center"
            />
            <TypographyMuted 
              text={
                searchTerm 
                  ? `No se encontraron grupos que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
                  : "Comienza creando tu primer grupo para organizar usuarios y permisos."
              }
              className="text-center max-w-md mb-6"
            />
            {!searchTerm && (
              <ModalAgregarGrupo />
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Lista de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((grupo: GruposTypeModel) => (
              <CardGrupos key={grupo.id} grupo={grupo} />
            ))}
          </div>

          {/* Indicador de carga y trigger para scroll infinito */}
          <div ref={ref} className="flex flex-col items-center justify-center py-8 min-h-[120px] gap-3">
            {isFetchingNextPage && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Cargando más grupos...</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            )}
            {!hasNextPage && data.length > 0 && !isFetchingNextPage && (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-muted p-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <TypographyMuted 
                  text="Has visto todos los grupos"
                  className="text-sm font-medium"
                />
                <TypographyMuted 
                  text={`${data.length} grupo${data.length !== 1 ? "s" : ""} en total`}
                  className="text-xs"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

