import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Trash, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useMutationDeleteAplicativo } from "@/hooks/aplicativos/useMutationAplicativos";

export const ModalEliminarAplicativo = () => {
  /** ----- 1. modo y navegación ----- */
  const { id } = useParams(); // undefined = crear
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const inDeleteRoute = location.pathname.endsWith("/eliminar");
  const { aplicativo } = useLoaderData() ?? { aplicativo: null };
  const data = aplicativo;
  /** ----- 2. estado del modal ----- */
  const [open, setOpen] = useState(isEdit || inDeleteRoute);

  /** ----- 3. hook de formulario ----- */
  const { mutation } = useMutationDeleteAplicativo();

  /** ----- 4. cerrar con la X o backdrop ----- */
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value && (isEdit || inDeleteRoute)) {
      navigate("..", { replace: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEdit && !inDeleteRoute && (
        <DialogTrigger asChild>
          <Button variant="custom2" asChild>
            <Link to="nuevo" state={{ modal: true }}>
              <Trash /> Eliminar
            </Link>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Eliminar aplicativo</DialogTitle>
        </DialogHeader>

        {mutation.isPending ? (
          <div className="flex justify-center p-6">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>¿Estás seguro de querer eliminar este aplicativo?</p>
            <p>
              <span className="font-bold">Nombre:</span> {data?.nombre}
            </p>
            <p>
              <span className="font-bold">Descripción:</span> {data?.descripcion}
            </p>
            <p>
              <span className="font-bold">Configuración:</span> {JSON.stringify(data?.configuracion)}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              navigate("..", { replace: true });
            }}
          >
            <X /> Cancelar
          </Button>
          <Button variant="custom2" disabled={mutation.isPending} onClick={() => mutation.mutate({ id: id ?? "" })}>
            {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
