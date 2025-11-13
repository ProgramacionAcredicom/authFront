import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import FormCrearGrupo from "@/components/form/formulario-crear-grupo";
import { useFormGrupos } from "@/hooks/formularios/grupos/useFormGrupos";

export const ModalAgregarGrupo = () => {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, isLoading } = useFormGrupos(setOpen, undefined, [], () => {});
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="custom2">
          <Plus /> Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Agregar Grupo</DialogTitle>
          <DialogDescription className="sr-only">Asigna un grupo a un usuario</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <FormCrearGrupo form={form} onSubmit={onSubmit} />
          {/* Los usuarios solo se pueden asignar al editar un grupo, no al crearlo */}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="outline"
            onClick={() => {
              setOpen(false);
              form.reset();
            }}
          >
            <X />
            Cancelar
          </Button>
          <Button type="submit" variant="custom2" form="permisos-form" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
