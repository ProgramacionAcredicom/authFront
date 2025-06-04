import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { AppWindow, KeyRound, LetterText, Save, X } from "lucide-react";
import { useState } from "react";
import { useFormPermisosEditar } from "@/hooks/formularios/permisos/useFormPermisos";

import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useQueryAplicativos } from "@/hooks/aplicativos/useQueryAplicativos";

export const ModalEditarPermiso = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { permiso } = useLoaderData() ?? { permiso: null };
  const [open, setOpen] = useState(isEdit);
  const { form, onSubmit } = useFormPermisosEditar(permiso, setOpen, id);
  /** ----- 4. cerrar con la X o backdrop ----- */
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && isEdit) {
      navigate("..", { replace: true });
    }
  };
  const { queryAplicativos } = useQueryAplicativos();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Editar permiso</DialogTitle>
          <DialogDescription className="sr-only">Asigna un permiso a un usuario</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="formulario-editar-permisos" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="aplicativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aplicativo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-full" startContent={<AppWindow className="size-4" />}>
                        <SelectValue placeholder="Selecciona un aplicativo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {queryAplicativos.data?.map((aplicativo) => (
                        <SelectItem key={aplicativo.id} value={aplicativo.id.toString()}>
                          {aplicativo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Permiso</FormLabel>
                  <FormControl>
                    <Input {...field} startContent={<KeyRound className="size-4" />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} startContent={<LetterText className="size-4" />} />
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
              // setOpen(false);
              form.reset();
            }}
          >
            <X />
            Cancelar
          </Button>
          <Button type="submit" variant="custom2" form="formulario-editar-permisos">
            <Save />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
