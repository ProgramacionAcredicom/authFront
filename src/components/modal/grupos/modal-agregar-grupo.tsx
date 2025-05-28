import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import FormCrearGrupo from "@/components/form/formulario-crear-grupo";
import { useFormGrupos } from "@/hooks/formularios/grupos/useFormGrupos";
export const ModalAgregarGrupo = () => {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, isLoading } = useFormGrupos(setOpen);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="custom2">
          <Plus /> Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Agregar Grupo</DialogTitle>
          <DialogDescription className="sr-only">Asigna un grupo a un usuario</DialogDescription>
        </DialogHeader>
        <FormCrearGrupo form={form} onSubmit={onSubmit} />
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
