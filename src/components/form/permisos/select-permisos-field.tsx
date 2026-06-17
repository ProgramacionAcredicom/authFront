import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { FieldValues, Path, PathValue, UseFormReturn, useWatch } from "react-hook-form";
import { useInView } from "react-intersection-observer";

import { useQueryPermisos } from "@/hooks/permisos/useQueryPermisos";
import { ResultModel } from "@/interfaces/permisos.interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SelectPermisosFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  searchPlaceholder?: string;
  availableLabel?: string;
  selectedLabel?: string;
  emptySelectedText?: string;
}

export function SelectPermisosField<TFieldValues extends FieldValues>({
  form,
  name,
  searchPlaceholder = "Buscar en permisos disponibles",
  availableLabel = "Permisos disponibles",
  selectedLabel = "Permisos seleccionados",
  emptySelectedText = "Arrastra permisos aquí o haz clic para seleccionar",
}: SelectPermisosFieldProps<TFieldValues>) {
  const [searchNombre, setSearchNombre] = useState("");
  const [draggedPermiso, setDraggedPermiso] = useState<ResultModel | null>(null);
  const [todosLosCargados, setTodosLosCargados] = useState<ResultModel[]>([]);
  const [selectedItemsCache, setSelectedItemsCache] = useState<ResultModel[]>([]);
  const [selectedItems, setSelectedItems] = useState<ResultModel[]>([]);

  const selectedPermisos = (useWatch({
    control: form.control,
    name,
  }) as number[] | undefined) ?? [];

  const { useInfinitePermisos } = useQueryPermisos(undefined, searchNombre);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePermisos;
  const { ref, inView } = useInView();

  const setSelectedPermisos = (ids: number[]) => {
    form.setValue(name, ids as PathValue<TFieldValues, Path<TFieldValues>>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    setTodosLosCargados([]);
  }, [searchNombre]);

  useEffect(() => {
    if (!data) return;

    const nuevos = data.pages.flatMap((page) => page.results);
    setTodosLosCargados((prev) => {
      const combinados = [...prev];

      nuevos.forEach((permiso) => {
        if (!combinados.some((item) => item.id === permiso.id)) {
          combinados.push(permiso);
        }
      });

      return combinados;
    });
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const nuevos = data.pages.flatMap((page) => page.results);
    const nuevosSeleccionados = nuevos.filter((permiso) => selectedPermisos.includes(permiso.id));

    if (nuevosSeleccionados.length === 0) return;

    setSelectedItemsCache((prev) => {
      const combinados = [...prev];

      nuevosSeleccionados.forEach((permiso) => {
        if (!combinados.some((item) => item.id === permiso.id)) {
          combinados.push(permiso);
        }
      });

      return combinados;
    });
  }, [data, selectedPermisos]);

  useEffect(() => {
    if (selectedPermisos.length === 0) {
      setSelectedItems([]);
      return;
    }

    const permisosEnCache = selectedItemsCache.filter((permiso) => selectedPermisos.includes(permiso.id));
    const permisosFaltantes = selectedPermisos.filter((id) => !permisosEnCache.some((permiso) => permiso.id === id));

    if (permisosFaltantes.length > 0) {
      const encontradosEnDisponibles = todosLosCargados.filter((permiso) => permisosFaltantes.includes(permiso.id));

      if (encontradosEnDisponibles.length > 0) {
        setSelectedItemsCache((prev) => {
          const combinados = [...prev];

          encontradosEnDisponibles.forEach((permiso) => {
            if (!combinados.some((item) => item.id === permiso.id)) {
              combinados.push(permiso);
            }
          });

          return combinados;
        });
      }

      const aunFaltantes = permisosFaltantes.filter((id) => !encontradosEnDisponibles.some((permiso) => permiso.id === id));

      if (aunFaltantes.length > 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }

    setSelectedItems(selectedItemsCache.filter((permiso) => selectedPermisos.includes(permiso.id)));
  }, [selectedItemsCache, selectedPermisos, todosLosCargados, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredPermisos = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);
  const availablePermisos = useMemo(
    () => filteredPermisos.filter((permiso) => !selectedPermisos.includes(permiso.id)),
    [filteredPermisos, selectedPermisos],
  );

  const handleDragStart = (event: React.DragEvent, permiso: ResultModel) => {
    setDraggedPermiso(permiso);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const moveToSelected = (permiso: ResultModel) => {
    if (selectedPermisos.includes(permiso.id)) return;

    setSelectedPermisos([...selectedPermisos, permiso.id]);
    setSelectedItemsCache((prev) => {
      if (prev.some((item) => item.id === permiso.id)) return prev;
      return [...prev, permiso];
    });
  };

  const moveToAvailable = (permiso: ResultModel) => {
    setSelectedPermisos(selectedPermisos.filter((id) => id !== permiso.id));
  };

  const handleDropToSelected = (event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedPermiso) return;
    moveToSelected(draggedPermiso);
    setDraggedPermiso(null);
  };

  const handleDropToAvailable = (event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedPermiso) return;
    moveToAvailable(draggedPermiso);
    setDraggedPermiso(null);
  };

  const moveAllToSelected = () => {
    const allIds = filteredPermisos.map((permiso) => permiso.id);
    setSelectedPermisos(allIds);
    setSelectedItemsCache((prev) => {
      const combinados = [...prev];

      filteredPermisos.forEach((permiso) => {
        if (!combinados.some((item) => item.id === permiso.id)) {
          combinados.push(permiso);
        }
      });

      return combinados;
    });
  };

  const moveAllToAvailable = () => {
    setSelectedPermisos([]);
  };

  return (
    <div className="grid grid-cols-[repeat(1,1fr_auto_1fr)] gap-4">
      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <Label>{availableLabel}</Label>
          <span className="text-sm text-muted-foreground">{availablePermisos.length} permisos</span>
        </div>
        <div className="relative mb-2">
          <Input
            className="pl-10"
            type="text"
            placeholder={searchPlaceholder}
            value={searchNombre}
            onChange={(event) => setSearchNombre(event.target.value)}
            startContent={<Search className="size-4" />}
          />
        </div>
        <div
          className="mt-3 h-62 overflow-y-auto rounded-lg border bg-muted/30 p-2"
          onDragOver={handleDragOver}
          onDrop={handleDropToAvailable}
        >
          {availablePermisos.map((permiso) => (
            <div
              key={permiso.id}
              draggable
              onDragStart={(event) => handleDragStart(event, permiso)}
              onClick={() => moveToSelected(permiso)}
              className="mb-2 cursor-pointer rounded-md border bg-background p-3 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Label className="text-xs">{permiso.aplicativo.nombre}</Label>
                <Badge variant="outline" className="text-xs">
                  {permiso.nombre}
                </Badge>
              </div>
              <Label className="mt-1 text-xs text-muted-foreground">{permiso.descripcion}</Label>
            </div>
          ))}

          {availablePermisos.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">No hay permisos disponibles</div>
          ) : null}

          <div ref={ref} className="py-4">
            {isFetchingNextPage ? (
              <div className="flex items-center justify-center">
                <Loader2 className="size-4 animate-spin" />
                <span className="ml-2 text-sm">Cargando más...</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <Button type="button" variant="outline" size="icon" onClick={moveAllToSelected} title="Mover todos a seleccionados">
          <ChevronRight className="size-4" />
          <ChevronRight className="-ml-3 size-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={moveAllToAvailable} title="Quitar todos los seleccionados">
          <ChevronLeft className="size-4" />
          <ChevronLeft className="-ml-3 size-4" />
        </Button>
      </div>

      <div className="flex flex-col">
        <div className="mb-2 flex items-center justify-between">
          <Label>{selectedLabel}</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedItems.length} permisos</span>
            <Button type="button" variant="ghost" size="icon" onClick={moveAllToAvailable} title="Eliminar todos" className="size-8">
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mb-2 h-9" />
        <div
          className="h-62 overflow-y-auto rounded-lg border bg-muted/30 p-2"
          onDragOver={handleDragOver}
          onDrop={handleDropToSelected}
        >
          {selectedItems.length > 0 ? (
            selectedItems.map((permiso) => (
              <div
                key={permiso.id}
                draggable
                onDragStart={(event) => handleDragStart(event, permiso)}
                onClick={() => moveToAvailable(permiso)}
                className="mb-2 cursor-pointer rounded-md border bg-background p-3 transition-all hover:border-destructive/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Label className="text-xs">{permiso.aplicativo.nombre}</Label>
                  <Badge variant="outline" className="text-xs">
                    {permiso.nombre}
                  </Badge>
                </div>
                <Label className="mt-1 text-xs text-muted-foreground">{permiso.descripcion}</Label>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">{emptySelectedText}</div>
          )}
        </div>
      </div>
    </div>
  );
}
