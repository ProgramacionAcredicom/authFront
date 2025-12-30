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
import { ResultModel } from "@/interfaces/permisos.interfaces";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";

export default function FormCrearGrupo({ form, onSubmit }: { form: UseFormReturn<CrearGrupoSchema>; onSubmit: (data: CrearGrupoSchema) => void }) {
  const [searchNombre, setSearchNombre] = useState("");
  const [draggedPermiso, setDraggedPermiso] = useState<ResultModel | null>(null);

  // -------------- Hook infinito para permisos "disponibles" (columna izquierda) --------------
  const { useInfinitePermisos } = useQueryPermisos(undefined, searchNombre);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePermisos;
  const { ref, inView } = useInView();

  // Este estado acumulará **todos** los permisos que se hayan descargado en cualquiera de las páginas:
  // Se limpia cuando cambia la búsqueda para mostrar solo los resultados de la búsqueda actual
  const [todosLosCargados, setTodosLosCargados] = useState<ResultModel[]>([]);
  
  // Cache separado para permisos seleccionados que NO se limpia con la búsqueda
  const [selectedItemsCache, setSelectedItemsCache] = useState<ResultModel[]>([]);

  // IDs actualmente seleccionados en el formulario
  const selectedPermisos = form.watch("permisos") || [];

  // Estado local para los objetos completos de los permisos seleccionados
  const [selectedItems, setSelectedItems] = useState<ResultModel[]>([]);

  // ──────────── 1) Limpiar cache de disponibles cuando cambia la búsqueda ────────────
  useEffect(() => {
    setTodosLosCargados([]);
  }, [searchNombre]);

  // ──────────── 2) Cada vez que "data" cambie, actualizamos el cache "todosLosCargados" ────────────
  //     Esto concatena nuevas páginas a nuestro arreglo y evita duplicados.
  //     Solo para permisos disponibles (no seleccionados).
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
  
  // ──────────── 2.5) Mantener cache de permisos seleccionados ────────────
  //     Este cache NO se limpia con la búsqueda, solo se actualiza cuando se agregan/quitan permisos
  useEffect(() => {
    if (!data) return;
    
    const nuevos = data.pages.flatMap((page) => page.results);
    // Solo agregar a selectedItemsCache los permisos que están seleccionados
    const nuevosSeleccionados = nuevos.filter((p) => selectedPermisos.includes(p.id));
    
    if (nuevosSeleccionados.length > 0) {
      setSelectedItemsCache((prev) => {
        const combinados = [...prev];
        nuevosSeleccionados.forEach((p) => {
          if (!combinados.some((x) => x.id === p.id)) {
            combinados.push(p);
          }
        });
        return combinados;
      });
    }
  }, [data, selectedPermisos]);

  // ──────────── 3) Actualizar "selectedItems" desde el cache de seleccionados ────────────
  //     Los permisos seleccionados se mantienen en selectedItemsCache que NO se limpia con la búsqueda
  useEffect(() => {
    if (selectedPermisos.length === 0) {
      setSelectedItems([]);
      return;
    }

    // Usar el cache de seleccionados que no se limpia con la búsqueda
    const iniciales = selectedItemsCache.filter((p) => selectedPermisos.includes(p.id));
    
    // Si hay permisos seleccionados pero no todos están en el cache,
    // intentamos cargarlos desde todosLosCargados o buscar más páginas
    const permisosFaltantes = selectedPermisos.filter((id) => !iniciales.some((p) => p.id === id));
    
    if (permisosFaltantes.length > 0) {
      // Primero intentar encontrarlos en todosLosCargados (puede que estén en la búsqueda actual)
      const encontradosEnDisponibles = todosLosCargados.filter((p) => permisosFaltantes.includes(p.id));
      if (encontradosEnDisponibles.length > 0) {
        setSelectedItemsCache((prev) => {
          const combinados = [...prev];
          encontradosEnDisponibles.forEach((p) => {
            if (!combinados.some((x) => x.id === p.id)) {
              combinados.push(p);
            }
          });
          return combinados;
        });
      }
      
      // Si aún faltan y hay más páginas, cargar más
      const aunFaltantes = permisosFaltantes.filter((id) => !encontradosEnDisponibles.some((p) => p.id === id));
      if (aunFaltantes.length > 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
    
    // Actualizar selectedItems con todos los permisos seleccionados del cache
    const todosSeleccionados = selectedItemsCache.filter((p) => selectedPermisos.includes(p.id));
    setSelectedItems(todosSeleccionados);
  }, [selectedItemsCache, selectedPermisos, todosLosCargados, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
  const handleDragStart = (e: React.DragEvent, permiso: ResultModel) => {
    setDraggedPermiso(permiso);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Suelta sobre "Selected" (columna derecha). Solo agregamos si no existía ya
  const handleDropToSelected = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPermiso && !selectedPermisos.includes(draggedPermiso.id)) {
      // 1) actualizamos el array de IDs en el form
      form.setValue("permisos", [...selectedPermisos, draggedPermiso.id], { shouldValidate: true });
      // 2) actualizamos el cache de seleccionados
      setSelectedItemsCache((prev) => {
        if (prev.some((p) => p.id === draggedPermiso.id)) return prev;
        return [...prev, draggedPermiso];
      });
    }
    setDraggedPermiso(null);
  };

  // Suelta sobre "Available" (columna izquierda). Solo quitamos si estaba en selectedPermisos
  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPermiso && selectedPermisos.includes(draggedPermiso.id)) {
      // 1) actualizamos el array de IDs en el form (quitamos ese ID)
      form.setValue(
        "permisos",
        selectedPermisos.filter((id) => id !== draggedPermiso.id),
        { shouldValidate: true },
      );
      // 2) No eliminamos del cache, solo se filtra en selectedItems por selectedPermisos
    }
    setDraggedPermiso(null);
  };

  // Click en un permiso de la columna izquierda → lo agregamos a "Selected"
  const moveToSelected = (permiso: ResultModel) => {
    if (!selectedPermisos.includes(permiso.id)) {
      form.setValue("permisos", [...selectedPermisos, permiso.id], { shouldValidate: true });
      // Agregar al cache de seleccionados
      setSelectedItemsCache((prev) => {
        if (prev.some((p) => p.id === permiso.id)) return prev;
        return [...prev, permiso];
      });
    }
  };

  // Click en un permiso de la columna derecha → lo quitamos de "Selected"
  const moveToAvailable = (permiso: ResultModel) => {
    form.setValue(
      "permisos",
      selectedPermisos.filter((id) => id !== permiso.id),
      { shouldValidate: true },
    );
    // No eliminamos del cache, solo se filtra en selectedItems por selectedPermisos
  };

  // Mover todos los disponibles a "Selected"
  const moveAllToSelected = () => {
    const allIds = filteredPermisos.map((permiso) => permiso.id);
    form.setValue("permisos", allIds, { shouldValidate: true });
    // Actualizamos el cache de seleccionados con todos los objetos que vinieron en filteredPermisos
    setSelectedItemsCache((prev) => {
      const combinados = [...prev];
      filteredPermisos.forEach((p) => {
        if (!combinados.some((x) => x.id === p.id)) {
          combinados.push(p);
        }
      });
      return combinados;
    });
  };

  // Quitar todos los seleccionados
  const moveAllToAvailable = () => {
    form.setValue("permisos", [], { shouldValidate: true });
    // No limpiamos el cache, solo se filtra en selectedItems por selectedPermisos
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
                      <Users2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
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
                <span className="text-sm text-gray-500 dark:text-gray-400">{availablePermisos.length} permisos</span>
              </div>
              <div className="relative mb-2">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
                <Input
                  className="pl-10"
                  type="text"
                  placeholder="Buscar en permisos disponibles"
                  value={searchNombre}
                  onChange={(e) => setSearchNombre(e.target.value)}
                />
              </div>
              <div className="h-62 mt-3 overflow-y-auto rounded-lg border bg-gray-50 dark:bg-neutral-900/50 p-2" onDragOver={handleDragOver} onDrop={handleDropToAvailable}>
                {availablePermisos.map((permiso) => (
                  <div
                    key={permiso.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, permiso)}
                    onClick={() => moveToSelected(permiso)}
                    className="mb-2 cursor-pointer rounded-md border bg-white dark:bg-neutral-800 p-3 transition-all hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">{permiso.aplicativo.nombre}</Label>
                      <Badge variant="outline" className="text-xs">{permiso.nombre}</Badge>
                    </div>
                    <Label className="mt-1 text-xs text-gray-500 dark:text-gray-400">{permiso.descripcion}</Label>
                  </div>
                ))}
                {availablePermisos.length === 0 && (
                  <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">No hay permisos disponibles</div>
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">{selectedItems.length} permisos</span>
                  <Button type="button" variant="ghost" size="icon" onClick={moveAllToAvailable} title="Eliminar todos" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-2 h-9" /> {/* Spacer para alinear con el input de búsqueda */}
              <div className="h-62 overflow-y-auto rounded-lg border bg-gray-50 dark:bg-neutral-900/50 p-2" onDragOver={handleDragOver} onDrop={handleDropToSelected}>
                {selectedItems.length > 0 ? (
                  selectedItems.map((permiso) => (
                    <div
                      key={permiso.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, permiso)}
                      onClick={() => moveToAvailable(permiso)}
                      className="mb-2 cursor-pointer rounded-md border bg-white dark:bg-neutral-800 p-3 transition-all hover:border-red-300 dark:hover:border-red-600 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">{permiso.aplicativo.nombre}</Label>
                        <Badge variant="outline" className="text-xs">{permiso.nombre}</Badge>
                      </div>
                      <Label className="mt-1 text-xs text-gray-500 dark:text-gray-400">{permiso.descripcion}</Label>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">Arrastra permisos aquí o haz clic para seleccionar</div>
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
