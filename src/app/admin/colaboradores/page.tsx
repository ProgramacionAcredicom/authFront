import { Title } from "@/components/title/Title";
import PageContainer from "@/components/layout/page-container";
import ColaboradoresTablePage from "@/components/tables/colaboradores/page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
export const ColaboradoresPage = () => {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Title text="Colaboradores" />
          <Button variant="custom2" asChild>
            <Link to="agregar">
              <Plus className="mr-2 h-4 w-4" /> Nuevo
            </Link>
          </Button>
        </div>
        <ColaboradoresTablePage />
      </div>
    </PageContainer>
  );
};
