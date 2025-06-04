import { Link } from "react-router-dom";
import { Title } from "@/components/title/Title";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AplicativosTablePage from "@/components/tables/asignacionAplicativos/page";

export const AplicativosPage = () => {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Title text="Aplicativos" />
          <Button variant="custom2" asChild>
            <Link to="agregar">
              <Plus className="mr-2 h-4 w-4" /> Nuevo
            </Link>
          </Button>
        </div>
        <AplicativosTablePage />
      </div>
    </PageContainer>
  );
};
