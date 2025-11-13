import { useState, useMemo, useEffect } from "react";
import { useQueryGrupos } from "@/hooks/grupos/useQueryGrupos";
import { ModalAgregarGrupo } from "@/components/modal/grupos/modal-agregar-grupo";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { CardGrupos } from "@/components/ui/cardGrupos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { localGruposMapper } from "@/mappers/local-grupos.mapper";

const ITEMS_PER_PAGE = 8;

export default function TabGrupos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { queryGrupos } = useQueryGrupos({ 
    page: currentPage, 
    page_size: ITEMS_PER_PAGE,
    search: searchTerm || undefined 
  });
  
  // Mapear los resultados de la respuesta paginada
  const data = useMemo((): GruposTypeModel[] => {
    if (!queryGrupos.data?.results) return [];
    return queryGrupos.data.results.map((grupo) => localGruposMapper(grupo));
  }, [queryGrupos.data]);

  // Obtener información de paginación del servidor
  // Mantener valores anteriores durante la carga para evitar que desaparezcan los controles
  const totalPages = queryGrupos.data?.total_pages ?? (queryGrupos.isLoading ? undefined : 0);
  const totalItems = queryGrupos.data?.total ?? (queryGrupos.isLoading ? undefined : 0);
  
  // Usar valores anteriores si están disponibles durante la carga
  const [previousTotalPages, setPreviousTotalPages] = useState<number>(0);
  const [previousTotalItems, setPreviousTotalItems] = useState<number>(0);
  
  useEffect(() => {
    if (queryGrupos.data?.total_pages) {
      setPreviousTotalPages(queryGrupos.data.total_pages);
    }
    if (queryGrupos.data?.total) {
      setPreviousTotalItems(queryGrupos.data.total);
    }
  }, [queryGrupos.data]);
  
  // Usar valores actuales o anteriores para mantener la paginación visible
  const displayTotalPages = totalPages ?? previousTotalPages;
  const displayTotalItems = totalItems ?? previousTotalItems;

  // Ajustar página si está fuera de rango (solo cuando tenemos datos del servidor)
  useEffect(() => {
    // Solo ajustar si tenemos datos del servidor y no estamos cargando
    if (!queryGrupos.isLoading && queryGrupos.data && queryGrupos.data.total_pages > 0) {
      // Si la página actual es mayor que el total de páginas, ajustar a la última página
      setCurrentPage((prevPage) => {
        if (prevPage > queryGrupos.data.total_pages) {
          return queryGrupos.data.total_pages;
        }
        return prevPage;
      });
    }
  }, [queryGrupos.data, queryGrupos.isLoading]); // Usamos función de actualización para acceder al valor actual

  // Resetear a página 1 cuando cambia la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Navegación de páginas
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(displayTotalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(displayTotalPages);

  // Calcular índices para mostrar (basado en datos del servidor, no filtrados)
  const startIndex = (queryGrupos.data || previousTotalItems > 0) ? (currentPage - 1) * ITEMS_PER_PAGE : 0;
  const endIndex = queryGrupos.data 
    ? Math.min(startIndex + (queryGrupos.data.results?.length || 0), displayTotalItems)
    : previousTotalItems > 0
    ? Math.min(startIndex + ITEMS_PER_PAGE, previousTotalItems)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <TypographyH3 text="Grupos" className="text-custom-gray" />
          <TypographyMuted text="Gestiona los grupos del sistema" />
        </div>
        <ModalAgregarGrupo />
      </header>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar por grupo o usuario"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          startContent={<Search className="h-4 w-4" />}
          className="max-w-xs"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange("")}
            className="h-9"
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Contenido - Solo esta sección se recarga */}
      {queryGrupos.isLoading && !queryGrupos.data ? (
        // Estado inicial de carga (primera vez)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 && !queryGrupos.isLoading ? (
        // Sin resultados
        <div className="flex items-center justify-center py-12">
          <TypographyMuted 
            text={searchTerm ? "No se encontraron grupos o usuarios con ese nombre" : "No hay grupos disponibles"} 
          />
        </div>
      ) : (
        <>
          {/* Lista de cards - muestra datos anteriores mientras carga o datos nuevos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {queryGrupos.isLoading && queryGrupos.data ? (
              // Muestra datos anteriores con overlay de carga
              <>
                {data.map((grupo: GruposTypeModel) => (
                  <div key={grupo.id} className="relative">
                    <div className="opacity-50 pointer-events-none">
                      <CardGrupos grupo={grupo} />
                    </div>
                    <div className="absolute inset-0 bg-background/50 animate-pulse rounded-lg" />
                  </div>
                ))}
              </>
            ) : (
              // Muestra datos normalmente
              data.map((grupo: GruposTypeModel) => (
                <CardGrupos key={grupo.id} grupo={grupo} />
              ))
            )}
          </div>

          {/* Paginación - siempre visible si hay más de 1 página (usa valores anteriores durante carga) */}
          {displayTotalPages > 1 && (
            <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row sm:gap-6">
              <div className="text-muted-foreground text-sm whitespace-nowrap">
                Mostrando {startIndex + 1} - {Math.min(endIndex, displayTotalItems)} de {displayTotalItems} grupo(s)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Ir a la primera página"
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1 || queryGrupos.isLoading}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  aria-label="Ir a la página anterior"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1 || queryGrupos.isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center text-sm font-medium min-w-[120px]">
                  Página {currentPage} de {displayTotalPages}
                </div>
                <Button
                  aria-label="Ir a la página siguiente"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={goToNextPage}
                  disabled={currentPage === displayTotalPages || queryGrupos.isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  aria-label="Ir a la última página"
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={goToLastPage}
                  disabled={currentPage === displayTotalPages || queryGrupos.isLoading}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

