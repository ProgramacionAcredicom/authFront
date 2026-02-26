import { Title } from "@/components/title/Title";
import { PageShell } from "@/components/layout/page-shell";
import ColaboradoresTablePage from "@/components/tables/colaboradores/page";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Link, useNavigation } from "react-router-dom";
export const ColaboradoresPage = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <>
      {isNavigating ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-12 animate-spin" />
        </div>
      ) : (
        <PageShell>
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
        </PageShell>
      )}
    </>
  );
};
