import { useState, useMemo, useEffect } from "react";
import { useQueryGrupos } from "@/hooks/grupos/useQueryGrupos";
import { ModalAgregarGrupo } from "@/components/modal/grupos/modal-agregar-grupo";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { CardGrupos } from "@/components/ui/cardGrupos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";

const ITEMS_PER_PAGE = 8;

export default function TabGrupos() {
  const { queryGrupos } = useQueryGrupos();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const data = queryGrupos.data || [];

  // Filtrar grupos por nombre del grupo o nombre de usuarios
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const searchLower = searchTerm.toLowerCase();
    return data.filter((grupo: GruposTypeModel) => {
      // Buscar en el nombre del grupo
      const matchesNombre = grupo.nombre.toLowerCase().includes(searchLower);
      
      // Buscar en los nombres de los usuarios del grupo
      const matchesUsuarios = grupo.users?.some((user) =>
        user.name?.toLowerCase().includes(searchLower)
      ) || false;
      
      return matchesNombre || matchesUsuarios;
    });
  }, [data, searchTerm]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Ajustar página si está fuera de rango
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
    } else if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Resetear a página 1 cuando cambia la búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Navegación de páginas
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  if (queryGrupos.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <div>
            <TypographyH3 text="Grupos" className="text-custom-gray" />
            <TypographyMuted text="Gestiona los grupos del sistema" />
          </div>
          <ModalAgregarGrupo />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

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

      {/* Contenido */}
      {filteredData.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <TypographyMuted 
            text={searchTerm ? "No se encontraron grupos o usuarios con ese nombre" : "No hay grupos disponibles"} 
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedData.map((grupo: GruposTypeModel) => (
              <CardGrupos key={grupo.id} grupo={grupo} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row sm:gap-6">
              <div className="text-muted-foreground text-sm whitespace-nowrap">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredData.length)} de {filteredData.length} grupo(s)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Ir a la primera página"
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  aria-label="Ir a la página anterior"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center text-sm font-medium min-w-[120px]">
                  Página {currentPage} de {totalPages}
                </div>
                <Button
                  aria-label="Ir a la página siguiente"
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  aria-label="Ir a la última página"
                  variant="outline"
                  size="icon"
                  className="hidden size-8 lg:flex"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
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

