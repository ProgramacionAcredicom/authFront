import type React from "react";
import { useEffect, useState } from "react";
import { Loader2, Search, Trash2, Users2, ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import { useInView } from "react-intersection-observer";
import { useQueryPermisos } from "@/hooks/permisos/useQueryPermisos";
import { CrearGrupoSchema } from "@/schemas/grupos/grupos.schema";
import { PermisoModel } from "@/interfaces/grupos.interfaces";
import { Switch } from "../ui/switch";

export default function FormCrearGrupo({ form, onSubmit }: { form: UseFormReturn<CrearGrupoSchema>; onSubmit: (data: CrearGrupoSchema) => void }) {
  const [searchNombre, setSearchNombre] = useState("");
  const [draggedPermiso, setDraggedPermiso] = useState<PermisoModel | null>(null);

  // -------------- Hook infinito para permisos “disponibles” (columna izquierda) --------------
  const { useInfinitePermisos } = useQueryPermisos(undefined, searchNombre);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePermisos;
  const { ref, inView } = useInView();

  // Este estado acumulará **todos** los permisos que se hayan descargado en cualquiera de las páginas:
  const [todosLosCargados, setTodosLosCargados] = useState<PermisoModel[]>([]);

  // IDs actualmente seleccionados en el formulario
  const selectedPermisos = form.watch("permisos") || [];

  // Estado local para los objetos completos de los permisos seleccionados
  const [selectedItems, setSelectedItems] = useState<PermisoModel[]>([]);

  // ──────────── 1) Cada vez que “data” cambie, actualizamos el cache “todosLosCargados” ────────────
  //     Esto concatena nuevas páginas a nuestro arreglo y evita duplicados.
  useEffect(() => {
    if (!data) return;

    const nuevos = data.pages.flatMap((page) => page.results);
    setTodosLosCargados((prev) => {
      // Evitar duplicados: si el ID ya existía, no lo agregamos de nuevo
      const combinados = [...prev];
      nuevos.forEach((p) => {
        if (!combinados.some((x) => x.id === p.id)) {
          combinados.push(p);
        }
      });
      return combinados;
    });
  }, [data]);

  // ──────────── 2) Inicializar “selectedItems” (solo una vez que tengamos ambos: el form & el cache total) ────────────
  // En este useEffect, usamos “todosLosCargados” para filtrar por IDs que ya venían en defaultValues.
  // Al depender de [todosLosCargados, selectedPermisos], este efecto se disparará:
  //   • la primera vez que “todosLosCargados” se llene con algo
  //   • o cada vez que cambie selectedPermisos (al agregar/quitar).
  useEffect(() => {
    // Si todavía no hay nada en el cache, salimos
    if (todosLosCargados.length === 0) return;

    // Filtramos SOLO los permisos cuyo ID esté en selectedPermisos
    const iniciales = todosLosCargados.filter((p) => selectedPermisos.includes(p.id));
    setSelectedItems(iniciales);
  }, [todosLosCargados, selectedPermisos]);

  // ──────────── 3) Scroll infinito para seguir cargando páginas “disponibles” ────────────
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // ──────────── 4) La lista “disponibles” se construye a partir de data.pages (resultados filtrados por búsqueda) ────────────
  const filteredPermisos = data?.pages.flatMap((page) => page.results) ?? [];
  // Solo mostramos en la izquierda lo que NO esté en selectedPermisos
  const availablePermisos = filteredPermisos.filter((p) => !selectedPermisos.includes(p.id));

  // ──────────── 5) Drag & drop y click para mover entre columnas ────────────
  const handleDragStart = (e: React.DragEvent, permiso: PermisoModel) => {
    setDraggedPermiso(permiso);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Suelta sobre “Selected” (columna derecha). Solo agregamos si no existía ya
  const handleDropToSelected = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPermiso && !selectedPermisos.includes(draggedPermiso.id)) {
      // 1) actualizamos el array de IDs en el form
      form.setValue("permisos", [...selectedPermisos, draggedPermiso.id], { shouldValidate: true });
      // 2) actualizamos nuestro estado local “selectedItems”
      setSelectedItems((prev) => [...prev, draggedPermiso]);
    }
    setDraggedPermiso(null);
  };

  // Suelta sobre “Available” (columna izquierda). Solo quitamos si estaba en selectedPermisos
  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPermiso && selectedPermisos.includes(draggedPermiso.id)) {
      // 1) actualizamos el array de IDs en el form (quitamos ese ID)
      form.setValue(
        "permisos",
        selectedPermisos.filter((id) => id !== draggedPermiso.id),
        { shouldValidate: true },
      );
      // 2) actualizamos selectedItems quitando ese objeto
      setSelectedItems((prev) => prev.filter((p) => p.id !== draggedPermiso.id));
    }
    setDraggedPermiso(null);
  };

  // Click en un permiso de la columna izquierda → lo agregamos a “Selected”
  const moveToSelected = (permiso: PermisoModel) => {
    if (!selectedPermisos.includes(permiso.id)) {
      form.setValue("permisos", [...selectedPermisos, permiso.id], { shouldValidate: true });
      setSelectedItems((prev) => [...prev, permiso]);
    }
  };

  // Click en un permiso de la columna derecha → lo quitamos de “Selected”
  const moveToAvailable = (permiso: PermisoModel) => {
    form.setValue(
      "permisos",
      selectedPermisos.filter((id) => id !== permiso.id),
      { shouldValidate: true },
    );
    setSelectedItems((prev) => prev.filter((p) => p.id !== permiso.id));
  };

  // Mover todos los disponibles a “Selected”
  const moveAllToSelected = () => {
    const allIds = filteredPermisos.map((permiso) => permiso.id);
    form.setValue("permisos", allIds, { shouldValidate: true });
    // Actualizamos selectedItems con todos los objetos que vinieron en filteredPermisos
    setSelectedItems(filteredPermisos);
  };

  // Quitar todos los seleccionados
  const moveAllToAvailable = () => {
    form.setValue("permisos", [], { shouldValidate: true });
    setSelectedItems([]);
  };

  // ──────────── 6) Render ────────────
  return (
    <div className="w-full max-w-4xl rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="permisos-form">
          {/* ======== HEADER (Nombre + Estado) ======== */}
          <header className="mb-4 flex w-full items-center gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="min-w-xs">
                  <FormLabel>Nombre del grupo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                      <Input type="text" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="mt-6 flex items-center gap-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} className="m-0" />
                  </FormControl>
                  <FormLabel>Estado</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </header>

          {/* ======== GRID PRINCIPAL ======== */}
          <div className="grid grid-cols-[repeat(1,1fr_auto_1fr)] gap-4">
            {/* ======== 1) Columna Izquierda: Permisos disponibles ======== */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <Label>Permisos disponibles</Label>
                <span className="text-sm text-gray-500">{availablePermisos.length} permisos</span>
              </div>
              <div className="relative mb-2">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
                <Input
                  className="pl-10"
                  type="text"
                  placeholder="Buscar en permisos disponibles"
                  value={searchNombre}
                  onChange={(e) => setSearchNombre(e.target.value)}
                />
              </div>
              <div className="h-96 overflow-y-auto rounded-lg border bg-gray-50 p-2" onDragOver={handleDragOver} onDrop={handleDropToAvailable}>
                {availablePermisos.map((permiso) => (
                  <div
                    key={permiso.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, permiso)}
                    onClick={() => moveToSelected(permiso)}
                    className="mb-2 cursor-pointer rounded-md border bg-white p-3 transition-all hover:border-blue-300 hover:shadow-sm"
                  >
                    <div className="text-sm font-medium">{permiso.aplicativo.nombre}</div>
                    <div className="mt-1 text-xs text-gray-500">{permiso.descripcion}</div>
                  </div>
                ))}
                {availablePermisos.length === 0 && (
                  <div className="flex h-full items-center justify-center text-gray-500">No hay permisos disponibles</div>
                )}
                <div ref={ref} className="py-4">
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm">Cargando más...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ======== 2) Botones centrales ======== */}
            <div className="flex flex-col items-center justify-center gap-2">
              <Button type="button" variant="outline" size="icon" onClick={moveAllToSelected} title="Mover todos a seleccionados">
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="-ml-3 h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={moveAllToAvailable} title="Quitar todos los seleccionados">
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="-ml-3 h-4 w-4" />
              </Button>
            </div>

            {/* ======== 3) Columna Derecha: Permisos seleccionados ======== */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <Label>Permisos seleccionados</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{selectedItems.length} permisos</span>
                  <Button type="button" variant="ghost" size="icon" onClick={moveAllToAvailable} title="Eliminar todos" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-2 h-9" /> {/* Spacer para alinear con el input de búsqueda */}
              <div className="h-96 overflow-y-auto rounded-lg border bg-gray-50 p-2" onDragOver={handleDragOver} onDrop={handleDropToSelected}>
                {selectedItems.length > 0 ? (
                  selectedItems.map((permiso) => (
                    <div
                      key={permiso.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, permiso)}
                      onClick={() => moveToAvailable(permiso)}
                      className="mb-2 cursor-pointer rounded-md border bg-white p-3 transition-all hover:border-red-300 hover:shadow-sm"
                    >
                      <div className="text-sm font-medium">{permiso.aplicativo.nombre}</div>
                      <div className="mt-1 text-xs text-gray-500">{permiso.descripcion}</div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">Arrastra permisos aquí o haz clic para seleccionar</div>
                )}
              </div>
            </div>
          </div>

          {form.formState.errors.permisos?.message && (
            <p className="text-destructive mt-2 text-[0.8rem] font-medium">{form.formState.errors.permisos.message?.toString()}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
