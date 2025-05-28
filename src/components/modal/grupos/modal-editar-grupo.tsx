import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import FormCrearGrupo from "@/components/form/formulario-crear-grupo";
import { useFormGrupos } from "@/hooks/formularios/grupos/useFormGrupos";
import { Aplicativo } from "@/interfaces/grupos.interfaces";

export const ModalEditarGrupo = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { grupo, permisos } = useLoaderData() ?? { grupo: null, permisos: null };
  const [open, setOpen] = useState(isEdit);
  const dataGrupoEditar = {
    id: id!,
    nombre: grupo?.nombre,
    permisos: permisos.map((permiso: Aplicativo) => permiso.id),
  };
  const { form, onSubmit } = useFormGrupos(setOpen, dataGrupoEditar);
  /** ----- 4. cerrar con la X o backdrop ----- */
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && isEdit) {
      navigate("..", { replace: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="md:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Editar grupo</DialogTitle>
          <DialogDescription className="sr-only">Edita un grupo</DialogDescription>
        </DialogHeader>
        <FormCrearGrupo form={form} onSubmit={onSubmit} />
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
          <Button type="submit" variant="custom2" form="permisos-form">
            <Save />
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
