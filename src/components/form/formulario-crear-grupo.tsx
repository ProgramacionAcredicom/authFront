import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CrearGrupoSchema } from "@/schemas/grupos/grupos.schema";
import { useQueryPermisos } from "@/hooks/permisos/useQueryPermisos";
import { useInView } from "react-intersection-observer";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SortableItem } from "./sortable-item";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
export default function FormCrearGrupo({ form, onSubmit }: { form: UseFormReturn<CrearGrupoSchema>; onSubmit: (data: CrearGrupoSchema) => void }) {
  const [searchNombre, setSearchNombre] = useState("");
  const { useInfinitePermisos } = useQueryPermisos(undefined, searchNombre);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePermisos;
  const { ref, inView } = useInView();

  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<any[]>([]);
  const { setNodeRef: setAvailableRef } = useDroppable({ id: "available-container" });
  const { setNodeRef: setSelectedRef } = useDroppable({ id: "selected-container" });
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Update available permissions when data changes
  useEffect(() => {
    if (data) {
      const allPermisos = data.pages.flatMap((page) => page.results);
      const selectedIds = form.getValues("permisos") || [];

      const selected = allPermisos.filter((permiso) => selectedIds.includes(permiso.id));
      const available = allPermisos.filter((permiso) => !selectedIds.includes(permiso.id));

      setSelectedPermissions(selected);
      setAvailablePermissions(available);
    }
  }, [data, form]);

  // Update form value when selected permissions change
  useEffect(() => {
    const selectedIds = selectedPermissions.map((p) => p.id);
    form.setValue("permisos", selectedIds, { shouldValidate: true });
  }, [selectedPermissions, form]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();

    // ¿Arrastrando desde DISPONIBLES?
    if (availablePermissions.some((p) => p.id.toString() === activeId)) {
      // soltar sobre contenedor o sobre un ítem ya seleccionado
      if (overId === "selected-container" || selectedPermissions.some((p) => p.id.toString() === overId)) {
        const permiso = availablePermissions.find((p) => p.id.toString() === activeId)!;
        setSelectedPermissions((prev) => [...prev, permiso]);
        setAvailablePermissions((prev) => prev.filter((p) => p.id.toString() !== activeId));
      }
    }

    // ¿Arrastrando desde SELECCIONADOS?
    if (selectedPermissions.some((p) => p.id.toString() === activeId)) {
      if (overId === "available-container" || availablePermissions.some((p) => p.id.toString() === overId)) {
        const permiso = selectedPermissions.find((p) => p.id.toString() === activeId)!;
        setAvailablePermissions((prev) => [...prev, permiso]);
        setSelectedPermissions((prev) => prev.filter((p) => p.id.toString() !== activeId));
      }
    }
  };

  const moveToSelected = (permiso: any) => {
    setSelectedPermissions((prev) => [...prev, permiso]);
    setAvailablePermissions((prev) => prev.filter((p) => p.id !== permiso.id));
  };

  const moveToAvailable = (permiso: any) => {
    setAvailablePermissions((prev) => [...prev, permiso]);
    setSelectedPermissions((prev) => prev.filter((p) => p.id !== permiso.id));
  };

  const moveAllToSelected = () => {
    setSelectedPermissions((prev) => [...prev, ...availablePermissions]);
    setAvailablePermissions([]);
  };

  const moveAllToAvailable = () => {
    setAvailablePermissions((prev) => [...prev, ...selectedPermissions]);
    setSelectedPermissions([]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="permisos-form" className="max-w-6xl">
        <header className="mb-4 flex flex-col gap-2">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del grupo</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label>Permisos</Label>
            <Input
              className="max-w-md"
              startContent={<Search className="h-4 w-4 text-gray-500" />}
              type="text"
              placeholder="Buscar permiso"
              value={searchNombre}
              onChange={(e) => setSearchNombre(e.target.value)}
            />
          </div>
        </header>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left Column - Available Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Permisos disponibles</span>
                  <Button variant="ghost" size="sm" onClick={moveAllToSelected} type="button" className="text-custom-gray">
                    <ArrowRight className="mr-1 h-4 w-4" />
                    Mover todos
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-5">
                <div id="available-container" ref={setAvailableRef} className="h-96 overflow-y-auto rounded-md bg-gray-50">
                  <SortableContext items={availablePermissions.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                    {availablePermissions.length > 0 ? (
                      availablePermissions.map((permiso) => (
                        <div key={permiso.id} className="mb-2">
                          <SortableItem id={permiso.id}>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                              <div className="flex-1">
                                <p className="font-medium">{permiso.aplicativo.nombre}</p>
                                <p className="text-sm text-gray-500">{permiso.descripcion}</p>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => moveToSelected(permiso)} className="h-8 w-8" type="button">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </SortableItem>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-gray-500">No hay permisos disponibles</span>
                      </div>
                    )}
                    {isFetchingNextPage && (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="text-sm">Cargando más...</span>
                      </div>
                    )}
                    <div ref={ref} className="h-1" />
                  </SortableContext>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Selected Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>Permisos seleccionados ({selectedPermissions.length})</span>
                  <Button variant="ghost" size="sm" onClick={moveAllToAvailable} type="button" className="text-custom-gray">
                    <Trash2 className="mr-1 h-4 w-4" />
                    Eliminar todos
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="-mt-5">
                <div id="selected-container" ref={setSelectedRef} className="h-96 overflow-y-auto rounded-md bg-gray-50">
                  <SortableContext items={selectedPermissions.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                    {selectedPermissions.length > 0 ? (
                      selectedPermissions.map((permiso) => (
                        <div key={permiso.id} className="mb-2">
                          <SortableItem id={permiso.id}>
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                              <div className="flex-1">
                                <p className="font-medium">{permiso.nombre}</p>
                                <p className="text-sm text-gray-500">{permiso.descripcion}</p>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => moveToAvailable(permiso)} className="h-8 w-8" type="button">
                                <ArrowLeft className="h-4 w-4" />
                              </Button>
                            </div>
                          </SortableItem>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-gray-500">No hay permisos seleccionados</span>
                      </div>
                    )}
                  </SortableContext>
                </div>
              </CardContent>
            </Card>
          </div>
        </DndContext>

        {form.formState.errors.permisos?.message && (
          <p className="text-destructive py-2 text-[0.8rem] font-medium">{form.formState.errors.permisos.message?.toString()}</p>
        )}
      </form>
    </Form>
  );
}
