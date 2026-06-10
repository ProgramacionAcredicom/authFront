import { useMemo, useState } from "react";
import { ArrowUpDown, Briefcase, Filter, Search, ShieldCheck } from "lucide-react";

import { ModalAgregarPuesto } from "@/components/modal/puestos/modal-agregar-puesto";
import { ModalEditarPuesto } from "@/components/modal/puestos/modal-editar-puesto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CardPuesto } from "@/components/ui/cardPuesto";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { useQueryPuestos } from "@/hooks/puestos/useQueryPuestos";
import { PuestoListItem } from "@/interfaces/puestos.interfaces";

type FilterOption = "all" | "active" | "inactive";
type SortOption = "role-asc" | "role-desc" | "created_on-asc" | "created_on-desc";

export default function TabPuestos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("role-asc");
  const [editingPuestoId, setEditingPuestoId] = useState<number | null>(null);
  const { queryPuestos } = useQueryPuestos();

  const allPuestos = queryPuestos.data ?? [];

  const data = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = allPuestos.filter((puesto) => {
      const matchesSearch = normalizedSearch.length === 0 || puesto.role.toLowerCase().includes(normalizedSearch);
      const matchesState =
        filterBy === "all" || (filterBy === "active" ? puesto.state : !puesto.state);

      return matchesSearch && matchesState;
    });

    return [...filtered].sort((left, right) => {
      switch (sortBy) {
        case "role-desc":
          return right.role.localeCompare(left.role);
        case "created_on-asc":
          return (left.created_on ?? "").localeCompare(right.created_on ?? "");
        case "created_on-desc":
          return (right.created_on ?? "").localeCompare(left.created_on ?? "");
        case "role-asc":
        default:
          return left.role.localeCompare(right.role);
      }
    });
  }, [allPuestos, filterBy, searchTerm, sortBy]);

  return (
    <>
      <div className="flex flex-col gap-6 px-4 py-4">
        <header className="flex items-center justify-between">
          <div>
            <TypographyH3 text="Puestos" className="text-custom-gray" />
            <TypographyMuted text="Gestiona los puestos del sistema y sus grupos de permisos asignados" />
          </div>
          <ModalAgregarPuesto />
        </header>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex max-w-md flex-1 items-center gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="Buscar por nombre del puesto..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-9 pr-9"
                  startContent={<Search className="size-4" />}
                />
                {searchTerm ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm("")}
                    className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
                    aria-label="Limpiar búsqueda"
                  >
                    <span className="sr-only">Limpiar</span>×
                  </Button>
                ) : null}
              </div>
            </div>
            {allPuestos.length > 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4" />
                <span>
                  {data.length} de {allPuestos.length} puesto{allPuestos.length !== 1 ? "s" : ""}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtros:</span>
            </div>
            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ordenar:</span>
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role-asc">Nombre (A-Z)</SelectItem>
                <SelectItem value="role-desc">Nombre (Z-A)</SelectItem>
                <SelectItem value="created_on-asc">Fecha creación (Más antiguo)</SelectItem>
                <SelectItem value="created_on-desc">Fecha creación (Más reciente)</SelectItem>
              </SelectContent>
            </Select>
            {filterBy !== "all" || sortBy !== "role-asc" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterBy("all");
                  setSortBy("role-asc");
                }}
                className="h-9"
              >
                Limpiar filtros
              </Button>
            ) : null}
          </div>
        </div>

        {queryPuestos.isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center px-4 py-16">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Briefcase className="size-8 text-muted-foreground" />
              </div>
              <TypographyH3
                text={searchTerm ? "No se encontraron puestos" : "No hay puestos disponibles"}
                className="mb-2 text-center"
              />
              <TypographyMuted
                text={
                  searchTerm
                    ? `No se encontraron puestos que coincidan con "${searchTerm}".`
                    : "Comienza creando tu primer puesto para asignarle permisos."
                }
                className="mb-6 max-w-md text-center"
              />
              {!searchTerm ? <ModalAgregarPuesto /> : null}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((puesto: PuestoListItem) => (
              <CardPuesto key={puesto.id} puesto={puesto} onEdit={setEditingPuestoId} />
            ))}
          </div>
        )}
      </div>

      <ModalEditarPuesto open={editingPuestoId !== null} onOpenChange={(open) => !open && setEditingPuestoId(null)} puestoId={editingPuestoId} />
    </>
  );
}
