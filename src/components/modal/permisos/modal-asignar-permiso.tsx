import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Edit, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { FormularioAsignarPermisos } from "../../form/formulario-asignar-permisos";
import { useFormListaPermisos, useFormPermisos } from "@/hooks/formularios/permisos/useFormPermisos";
import { ScrollArea } from "../../ui/scroll-area";
import { Card, CardContent } from "../../ui/card";
import { AsignarPermisosSchema } from "@/schemas/permisos/asignar-permisos.schema";
import { useQueryAplicativos } from "@/hooks/aplicativos/useQueryAplicativos";
import { Form } from "../../ui/form";

export const ModalAsignarPermiso = () => {
  const [permisos, setPermisos] = useState<AsignarPermisosSchema[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { queryAplicativos } = useQueryAplicativos();
  const { form } = useFormPermisos();

  const handleAddPermiso = (data: AsignarPermisosSchema) => {
    if (editingIndex !== null) {
      // Estamos editando un permiso existente
      const nuevosPermisos = [...permisos];
      nuevosPermisos[editingIndex] = data;
      setPermisos(nuevosPermisos);
      setEditingIndex(null);

      // Asegurarse de que el formulario se limpie completamente
      setTimeout(() => {
        form.reset({
          aplicativo: "",
          nombre: "",
          descripcion: "",
        });
      }, 0);
    } else {
      if (data.aplicativo === "") return form.setError("aplicativo", { message: "El aplicativo es requerido" });
      if (data.nombre === "") return form.setError("nombre", { message: "El nombre es requerido" });
      if (data.descripcion === "") return form.setError("descripcion", { message: "La descripción es requerida" });
      // Estamos agregando un nuevo permiso
      setPermisos([...permisos, data]);
      form.reset();
    }
  };

  const handleRemovePermiso = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el clic se propague a la tarjeta
    const nuevosPermisos = [...permisos];
    nuevosPermisos.splice(index, 1);
    setPermisos(nuevosPermisos);

    // Si estábamos editando este permiso, salir del modo edición
    if (editingIndex === index) {
      setEditingIndex(null);
      form.reset();
    }
  };

  const handleEditPermiso = (index: number) => {
    // Cargar los datos del permiso en el formulario
    const permiso = permisos[index];

    // Es importante resetear el formulario con todos los valores correctos
    form.reset({
      aplicativo: permiso.aplicativo,
      nombre: permiso.nombre,
      descripcion: permiso.descripcion || "",
    });

    setEditingIndex(index);

    // En dispositivos móviles, hacer scroll al formulario
    if (window.innerWidth < 768) {
      document.getElementById("formulario-asignar-permisos")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    form.reset({
      aplicativo: "",
      nombre: "",
      descripcion: "",
    });
  };
  // Función para obtener el nombre del aplicativo según su ID
  const getNombreAplicativo = (id: string) => {
    const aplicativo = queryAplicativos.data?.find((app) => app.id.toString() === id);
    return aplicativo?.nombre || id;
  };

  const [open, setOpen] = useState(false);
  /** ----- 4. cerrar con la X o backdrop ----- */
  const handleOpenChange = (value: boolean) => {
    form.reset();
    setPermisos([]);
    setOpen(value);
  };
  const { formListaPermisos, submitLista, isLoading } = useFormListaPermisos({ permisos, setPermisos, setOpen });
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="custom2">
          <Plus /> Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Agregar permiso</DialogTitle>
          <DialogDescription className="sr-only">Asigna un permiso a un usuario</DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-hidden md:flex-row">
          {/* Lista de permisos agregados */}
          <div className="flex flex-col md:w-1/2">
            <h3 className="mb-2 text-sm font-medium">Permisos agregados:</h3>
            {permisos.length > 0 ? (
              <Form {...formListaPermisos}>
                <form id="lista-permisos">
                  <ScrollArea className="h-[200px] flex-1 md:h-[300px]">
                    <div className="space-y-2 pr-2">
                      {permisos.map((permiso, index) => (
                        <Card
                          key={index}
                          className={`hover:bg-muted/30 cursor-pointer border-l-4 p-3 transition-colors ${
                            editingIndex === index ? "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20" : "border-l-primary/70"
                          }`}
                          onClick={() => handleEditPermiso(index)}
                        >
                          <CardContent className="flex flex-col gap-2 p-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 text-xs font-medium">Nombre:</span>
                                  <h4 className="text-sm font-semibold">{permiso.nombre}</h4>
                                  {editingIndex === index && (
                                    <span className="ml-2 rounded-full bg-orange-100 px-1.5 py-0.5 text-xs text-orange-700">Editando</span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleRemovePermiso(index, e)}
                                className="hover:bg-destructive/10 hover:text-destructive -mt-1 -mr-1 h-7 w-7 rounded-full"
                                type="button"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <span className="text-muted-foreground bg-muted mt-0.5 rounded px-1.5 py-0.5 text-xs font-medium">Descripción:</span>
                              <p className="flex-1 text-xs">
                                {permiso.descripcion || <span className="text-muted-foreground italic">Sin descripción</span>}
                              </p>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <span className="text-muted-foreground bg-muted mt-0.5 rounded px-1.5 py-0.5 text-xs font-medium">Aplicativo:</span>
                              <p className="text-xs font-medium">{getNombreAplicativo(permiso.aplicativo)}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </form>
              </Form>
            ) : (
              <div className="bg-muted/10 flex h-[200px] flex-1 items-center justify-center rounded-md border md:h-[300px]">
                <p className="text-muted-foreground text-sm">No hay permisos agregados</p>
              </div>
            )}
            {formListaPermisos.formState.errors.permisos && (
              <span className="text-destructive text-sm font-medium">{formListaPermisos.formState.errors.permisos.message}</span>
            )}
          </div>

          {/* Formulario para agregar permisos */}
          <div className="flex flex-col md:w-1/2">
            <h3 className="mb-2 text-sm font-medium">{editingIndex !== null ? "Editar permiso:" : "Agregar nuevo permiso:"}</h3>
            <div className="bg-card rounded-md border p-4">
              <FormularioAsignarPermisos form={form} />

              <div className="mt-4 flex justify-between">
                {editingIndex !== null ? (
                  <>
                    <Button type="button" variant="outline" onClick={handleCancelEdit} size="sm">
                      Cancelar
                    </Button>
                    <Button size="sm" variant="custom2" onClick={() => handleAddPermiso(form.getValues())}>
                      <Edit className="mr-2 h-4 w-4" />
                      Actualizar Permiso
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    size="sm"
                    variant="custom2"
                    id="formulario-asignar-permisos"
                    onClick={() => handleAddPermiso(form.getValues())}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Permiso
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              formListaPermisos.reset();
            }}
          >
            <X />
            Cancelar
          </Button>
          <Button type="submit" variant="custom2" form="lista-permisos" onClick={submitLista} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
