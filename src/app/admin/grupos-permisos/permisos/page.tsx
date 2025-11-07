import { Title } from "@/components/title/Title";
import PageContainer from "@/components/layout/page-container";
import PermisosTablePage from "@/components/tables/permisos/page";
import { ModalAsignarPermiso } from "@/components/modal/permisos/modal-asignar-permiso";
import { Outlet } from "react-router-dom";

export default function PermisosPage() {
  return (
    <>
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Title text="Permisos" />
            <ModalAsignarPermiso />
          </div>
          <PermisosTablePage />
        </div>
      </PageContainer>
      <Outlet />
    </>
  );
}

