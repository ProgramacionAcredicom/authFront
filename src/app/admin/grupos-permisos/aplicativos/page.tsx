import { Title } from "@/components/title/Title";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AplicativosTablePage from "@/components/tables/asignacionAplicativos/page";
import { AlertModal } from "@/components/modal/alert-modal";
import { useState } from "react";
import { FormularioAplicativos } from "@/components/form/formulario-aplicativos";
import { useFormAplicativos } from "@/hooks/formularios/aplicativos/useFormAplicativos";

export const AplicativosPage = () => {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, isLoading } = useFormAplicativos(undefined, setOpen, false);
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onSubmit(form.getValues())}
        title="Agregar Aplicativo"
        description="Agregar un nuevo aplicativo"
        loading={isLoading}
        className="sm:max-w-2xl"
      >
        <FormularioAplicativos form={form} onSubmit={onSubmit} />
      </AlertModal>
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Title text="Aplicativos" />
            <Button variant="custom2" onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo
            </Button>
          </div>
          <AplicativosTablePage />
        </div>
      </PageContainer>
    </>
  );
};
