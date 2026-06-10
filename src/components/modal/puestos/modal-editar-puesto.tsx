import { useEffect, useState } from "react";
import { Briefcase, Loader2, Save, X } from "lucide-react";

import { FormPuesto } from "@/components/form/puestos/form-puesto";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFormPuestos } from "@/hooks/formularios/puestos/useFormPuestos";
import { useQueryGruposSinPaginacion } from "@/hooks/grupos/useQueryGrupos";
import { useQueryPuestos } from "@/hooks/puestos/useQueryPuestos";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";

interface ModalEditarPuestoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  puestoId: number | null;
}

export const ModalEditarPuesto = ({ open, onOpenChange, puestoId }: ModalEditarPuestoProps) => {
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>([]);
  const { queryPuestoById } = useQueryPuestos(puestoId ?? undefined, { enabled: open && puestoId !== null });
  const { queryGruposSinPaginacion } = useQueryGruposSinPaginacion();
  const puesto = queryPuestoById.data;

  const { form, onSubmit, isLoading } = useFormPuestos(onOpenChange, puesto ? { ...puesto, id: String(puesto.id) } : undefined);

  useEffect(() => {
    if (!puesto) return;

    form.reset({
      role: puesto.role,
      grupos: puesto.grupos,
      state: puesto.state,
    });
  }, [puesto, form]);

  useEffect(() => {
    if (!puesto || !queryGruposSinPaginacion.data) return;

    const hydratedGroups = queryGruposSinPaginacion.data.filter((group) => puesto.grupos.includes(group.id));
    setSelectedGroups(hydratedGroups);
  }, [puesto, queryGruposSinPaginacion.data]);

  useEffect(() => {
    if (open) return;

    form.reset({
      role: "",
      grupos: [],
      state: true,
    });
    setSelectedGroups([]);
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Editar puesto</DialogTitle>
          <DialogDescription className="sr-only">Editar un puesto y sus grupos de permisos asignados</DialogDescription>
        </DialogHeader>

        {queryPuestoById.isLoading || queryGruposSinPaginacion.isLoading ? (
          <div className="flex items-center justify-center py-12" role="status" aria-label="Cargando datos del puesto">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : puesto ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Briefcase className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Actualizá el puesto y sus grupos de permisos</p>
                  <p className="text-sm text-muted-foreground">Los grupos del puesto se sincronizan con el backend a través del campo <code>grupos</code>.</p>
                </div>
              </div>
            </div>
            <FormPuesto form={form} onSubmit={onSubmit} selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No se pudo cargar el detalle del puesto.
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              form.reset({
                role: "",
                grupos: [],
                state: true,
              });
              setSelectedGroups([]);
            }}
          >
            <X />
            Cancelar
          </Button>
          <Button type="submit" variant="custom2" form="formulario-puesto" disabled={isLoading || queryPuestoById.isLoading || !puesto}>
            {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
