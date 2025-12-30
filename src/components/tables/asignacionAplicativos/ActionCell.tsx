// ActionCell.tsx
import { AlertTriangle, Edit, Ellipsis, Globe, Settings, Trash, Key } from "lucide-react";
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
import { ModalAppKeyInfo } from "@/components/modal/aplicativos/modal-app-key-info";
import { ModalGenerateAppKey } from "@/components/modal/aplicativos/modal-generate-app-key";

export function ActionCell({ data }: { data: AplicativosTypeModel }) {
  const [open, setOpen] = useState(false);
  const [openDesactivar, setOpenDesactivar] = useState(false);
  const [openAppKeyInfo, setOpenAppKeyInfo] = useState(false);
  const [openGenerateAppKey, setOpenGenerateAppKey] = useState(false);
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
        <div className="space-y-6">
          <FormularioAplicativos form={form} onSubmit={onSubmit} />
          {isEdit && (
            <div className="border-t pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Gestión de App Key</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gestiona la clave de aplicación para autenticación externa. La clave se almacena cifrada y solo se muestra una vez al generarla.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpenAppKeyInfo(true);
                  }}
                  className="flex-1"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Ver App Key
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpenGenerateAppKey(true);
                  }}
                  className="flex-1"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Generar App Key
                </Button>
              </div>
            </div>
          )}
        </div>
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
      <ModalAppKeyInfo
        isOpen={openAppKeyInfo}
        onClose={() => setOpenAppKeyInfo(false)}
        aplicativoId={id}
        aplicativoNombre={data.nombre}
      />
      <ModalGenerateAppKey
        isOpen={openGenerateAppKey}
        onClose={() => setOpenGenerateAppKey(false)}
        aplicativoId={id}
        aplicativoNombre={data.nombre}
      />
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
