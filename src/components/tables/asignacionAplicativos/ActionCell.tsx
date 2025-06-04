// ActionCell.tsx
import { Edit, Ellipsis } from "lucide-react";
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

export function ActionCell({ data }: { data: AplicativosTypeModel }) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(data);
  const { form, onSubmit, isLoading } = useFormAplicativos(data, setOpen, isEdit, data.id.toString());

  return (
    <>
      <AlertModal
        title="Actualizar Aplicativo"
        description="¿Estás seguro de querer actualizar este aplicativo?"
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onSubmit(form.getValues())}
        loading={isLoading}
      >
        <FormularioAplicativos form={form} onSubmit={onSubmit} />
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
          </DropdownMenuGroup>
          {/* <DropdownMenuSeparator /> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
