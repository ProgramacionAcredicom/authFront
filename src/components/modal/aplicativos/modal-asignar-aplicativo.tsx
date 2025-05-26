import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Save, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useFormAplicativos } from "@/hooks/formularios/aplicativos/useFormAplicativos";
import { FormularioAplicativos } from "../../form/formulario-aplicativos";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export const ModalAsignarAplicativo = () => {
  /** ----- 1. modo y navegación ----- */
  const { id } = useParams(); // undefined = crear
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const inCreateRoute = location.pathname.endsWith("/nuevo");
  const { aplicativo } = useLoaderData() ?? { aplicativo: null };
  const data = aplicativo;
  /** ----- 2. estado del modal ----- */
  const [open, setOpen] = useState(isEdit || inCreateRoute);

  /** ----- 3. hook de formulario ----- */
  const { form, onSubmit, isLoading } = useFormAplicativos(data, setOpen, isEdit, id ?? "");

  /** ----- 4. cerrar con la X o backdrop ----- */
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && (isEdit || inCreateRoute)) {
      navigate("..", { replace: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEdit && !inCreateRoute && (
        <DialogTrigger asChild>
          <Button variant="custom2" asChild>
            <Link to="nuevo" state={{ modal: true }}>
              <Plus /> Agregar
            </Link>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">{isEdit ? "Editar aplicativo" : "Agregar aplicativo"}</DialogTitle>
        </DialogHeader>

        {form.formState.isSubmitting ? (
          <div className="flex justify-center p-6">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <FormularioAplicativos form={form} onSubmit={onSubmit} />
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            <X /> Cancelar
          </Button>
          <Button type="submit" variant="custom2" form="formulario-asignar-aplicativos" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Save />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
