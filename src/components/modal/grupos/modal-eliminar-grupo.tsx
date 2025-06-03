import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { KeyRound, Trash2, X } from "lucide-react";
import { useState } from "react";

import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormGruposEliminar } from "@/hooks/formularios/grupos/useFormGrupos";

export const ModalEliminarGrupo = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [open, setOpen] = useState(isEdit);
  const { grupo } = useLoaderData() ?? { grupo: null };
  const { form, onSubmit } = useFormGruposEliminar(grupo, setOpen, id);
  /** ----- 4. cerrar con la X o backdrop ----- */
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && isEdit) {
      navigate("..", { replace: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Desactivar Grupo</DialogTitle>
          <DialogDescription className="sr-only">Desactiva un grupo</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="formulario-eliminar-permisos" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="aplicativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aplicativo</FormLabel>
                  <FormControl>
                    <Input {...field} startContent={<KeyRound className="size-4" />} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Grupo</FormLabel>
                  <FormControl>
                    <Input {...field} startContent={<KeyRound className="size-4" />} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
              form.reset();
            }}
          >
            <X />
            Cancelar
          </Button>
          <Button type="submit" variant="custom2" form="formulario-eliminar-permisos">
            <Trash2 />
            Desactivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
