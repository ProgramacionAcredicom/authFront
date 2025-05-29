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

export default function FormCrearGrupo({ form, onSubmit }: { form: UseFormReturn<CrearGrupoSchema>; onSubmit: (data: CrearGrupoSchema) => void }) {
  const [searchNombre, setSearchNombre] = useState("");
  const [draggedPermiso, setDraggedPermiso] = useState<any | null>(null);
  const { useInfinitePermisos } = useQueryPermisos(undefined, searchNombre);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePermisos;
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Get filtered permissions for the left side (available)
  const filteredPermisos = data?.pages.flatMap((page) => page.results) ?? [];

  // Get currently selected permission IDs from the form
  const selectedPermisos = form.watch("permisos") || [];

  // Filter available permissions - these are affected by the search
  const availablePermisos = filteredPermisos.filter((p) => !selectedPermisos.includes(p.id));

  // Get selected permissions data from the unfiltered list - these are NOT affected by the search

  const selectedPermisosData = data?.pages.flatMap((page) => page.results).filter((p: any) => selectedPermisos.includes(p.id));

  const handleDragStart = (e: React.DragEvent, permiso: any) => {
    setDraggedPermiso(permiso);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropToSelected = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPermiso && !selectedPermisos.includes(draggedPermiso.id)) {
      form.setValue("permisos", [...selectedPermisos, draggedPermiso.id], { shouldValidate: true });
    }
    setDraggedPermiso(null);
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPermiso && selectedPermisos.includes(draggedPermiso.id)) {
      form.setValue(
        "permisos",
        selectedPermisos.filter((id) => id !== draggedPermiso.id),
        { shouldValidate: true },
      );
    }
    setDraggedPermiso(null);
  };

  const moveToSelected = (permiso: any) => {
    if (!selectedPermisos.includes(permiso.id)) {
      form.setValue("permisos", [...selectedPermisos, permiso.id], { shouldValidate: true });
    }
  };

  const moveToAvailable = (permiso: any) => {
    form.setValue(
      "permisos",
      selectedPermisos.filter((id) => id !== permiso.id),
      { shouldValidate: true },
    );
  };

  const moveAllToSelected = () => {
    const allIds = filteredPermisos.map((permiso) => permiso.id);
    form.setValue("permisos", allIds, { shouldValidate: true });
  };

  const moveAllToAvailable = () => {
    form.setValue("permisos", [], { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-4xl rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="permisos-form">
          <header className="mb-4 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
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
          </header>

          <div className="grid grid-cols-[repeat(1,1fr_auto_1fr)] gap-4">
            {/* Available Permissions Column */}
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

            {/* Action Buttons Column */}
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

            {/* Selected Permissions Column */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <Label>Permisos seleccionados</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{selectedPermisosData?.length} permisos</span>
                  <Button type="button" variant="ghost" size="icon" onClick={moveAllToAvailable} title="Eliminar todos" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mb-2 h-9" /> {/* Spacer to align with search input */}
              <FormField
                name="permisos"
                control={form.control}
                render={() => (
                  <div className="h-96 overflow-y-auto rounded-lg border bg-gray-50 p-2" onDragOver={handleDragOver} onDrop={handleDropToSelected}>
                    {selectedPermisosData?.map((permiso) => (
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
                    ))}
                    {selectedPermisosData?.length === 0 && (
                      <div className="flex h-full items-center justify-center text-gray-500">Arrastra permisos aquí o haz clic para seleccionar</div>
                    )}
                  </div>
                )}
              />
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
