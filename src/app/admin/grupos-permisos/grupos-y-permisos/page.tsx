import AsignacionGruposTable from "@/components/tables/asignacionGrupos/page";
import AsignacionPermisosTable from "@/components/tables/asignacionPermisos/page";
import { columnsPage } from "@/components/tables/asignacionGrupos/columns";
import { columnsPermisosPorGrupo } from "@/components/tables/asignacionPermisos/columns";
import { useEffect, useState } from "react";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { useSearchParams, Outlet } from "react-router-dom";
import { useQueryPermisos } from "@/hooks/permisos/useQueryPermisos";

export const GruposPage = () => {
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get("id");
  const cols = idParam ? columnsPermisosPorGrupo : [];
  const { queryPermisos, queryPermisosById } = useQueryPermisos(idParam || undefined);
  const data = idParam ? queryPermisosById.data : queryPermisos.data?.results || [];
  const isLoading = idParam ? queryPermisosById.isLoading : queryPermisos.isLoading;
  useEffect(() => {
    if (selectedGroups.length > 0) {
      setSearchParams({ id: selectedGroups.map((g) => g.id).join(",") });
    } else {
      setSearchParams({});
    }
  }, [selectedGroups, setSearchParams]);

  return (
    <>
      <section className="grid grid-cols-2 gap-8">
        <AsignacionGruposTable columns={columnsPage} setSelectedRows={setSelectedGroups} />
        <AsignacionPermisosTable columns={cols} data={data} isLoading={isLoading} />
      </section>
      <Outlet />
    </>
  );
};
