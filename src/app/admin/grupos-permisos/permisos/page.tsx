import { Title } from "@/components/title/Title";
import { PageShell } from "@/components/layout/page-shell";
import PermisosTablePage from "@/components/tables/permisos/page";
import { ModalAsignarPermiso } from "@/components/modal/permisos/modal-asignar-permiso";
import { Outlet } from "react-router-dom";

export default function PermisosPage() {
  return (
    <>
      <PageShell>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex items-start justify-between">
            <Title text="Permisos" />
            <ModalAsignarPermiso />
          </div>
          <PermisosTablePage />
        </div>
      </PageShell>
      <Outlet />
    </>
  );
}
