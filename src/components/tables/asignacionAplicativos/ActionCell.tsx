// ActionCell.tsx
import { AlertTriangle, Edit, Ellipsis, Globe, Settings, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import { AlertModal } from "@/components/modal/alert-modal";
import { useState } from "react";
import { FormularioAplicativos } from "@/components/form/formulario-aplicativos";
import { useFormAplicativos } from "@/hooks/formularios/aplicativos/useFormAplicativos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutationDeleteAplicativo } from "@/hooks/aplicativos/useMutationAplicativos";

export function ActionCell({ data }: { data: AplicativosTypeModel }) {
  const [open, setOpen] = useState(false);
  const [openDesactivar, setOpenDesactivar] = useState(false);
  const isEdit = Boolean(data);
  const id = data.id.toString();
  const { form, onSubmit, isLoading } = useFormAplicativos(data, setOpen, isEdit, id);
  const { mutation, isLoading: isLoadingDesactivar } = useMutationDeleteAplicativo();
  const desactivarAplicativo = () => {
    mutation.mutate({ id });
    setOpenDesactivar(false);
  };
  return (
    <>
      <AlertModal
        title="Actualizar Aplicativo"
        description="¿Estás seguro de querer actualizar este aplicativo?"
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onSubmit(form.getValues())}
        loading={isLoading}
        className="sm:max-w-2xl"
      >
        <FormularioAplicativos form={form} onSubmit={onSubmit} />
      </AlertModal>
      <AlertModal
        title="Desactivar Aplicativo"
        description="¿Estás seguro de querer desactivar este aplicativo?"
        isOpen={openDesactivar}
        onClose={() => setOpenDesactivar(false)}
        onConfirm={() => desactivarAplicativo()}
        loading={isLoadingDesactivar}
        // className="sm:max-w-2xl"
      >
        <div className="space-y-4">
          {/* Información básica */}
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {data.nombre}
                </span>
                <Badge variant={data.state ? "default" : "secondary"}>{data.state ? "Activo" : "Inactivo"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Descripción</p>
                <p className="text-sm">{data.descripcion}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <p className="text-muted-foreground mb-1 text-sm">ID del Aplicativo:</p>
                <p className="font-mono text-sm">{data.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="text-base">Configuración Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe className="text-muted-foreground h-4 w-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium">URL Webhook</p>
                  <p className="text-muted-foreground font-mono text-xs break-all">{data?.configuracion?.url_hook || "No hay URL Webhook"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advertencia */}
          <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
            <div className="flex gap-3">
              <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-destructive text-sm font-medium">Advertencia</p>
                <p className="text-muted-foreground text-sm">
                  Al desactivar este aplicativo, todos los usuarios activos perderán acceso inmediatamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AlertModal>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-3xs" side="right" align="start">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Actualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDesactivar(true)} className="text-red-500! hover:bg-red-400/20!">
              <Trash className="mr-2 h-4 w-4" /> Desactivar
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {/* <DropdownMenuSeparator /> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
