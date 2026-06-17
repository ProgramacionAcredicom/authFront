import { useState } from "react";
import { Briefcase, Loader2, Plus, Save, X } from "lucide-react";

import { FormPuesto } from "@/components/form/puestos/form-puesto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFormPuestos } from "@/hooks/formularios/puestos/useFormPuestos";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";

export const ModalAgregarPuesto = () => {
  const [open, setOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>([]);
  const { form, onSubmit, isLoading } = useFormPuestos(setOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset({
            role: "",
            grupos: [],
            state: true,
          });
          setSelectedGroups([]);
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="custom2">
          <Plus />
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Agregar puesto</DialogTitle>
          <DialogDescription className="sr-only">Crear un nuevo puesto y asignar grupos de permisos</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Briefcase className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Configurá el puesto y sus grupos de permisos</p>
                <p className="text-sm text-muted-foreground">Los grupos seleccionados se enviarán al backend usando el campo <code>grupos</code>.</p>
              </div>
            </div>
          </div>
          <FormPuesto form={form} onSubmit={onSubmit} selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
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
          <Button type="submit" variant="custom2" form="formulario-puesto" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
