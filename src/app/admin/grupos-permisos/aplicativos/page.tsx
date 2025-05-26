import { Outlet } from "react-router-dom";
import { columnsAplicativos } from "@/components/tables/asignacionAplicativos/columns";
import AsignacionAplicativosTable from "@/components/tables/asignacionAplicativos/page";
import { Title } from "@/components/title/Title";
import { useQueryAplicaivos } from "@/hooks/aplicativos/useQueryAplicativos";

export const AplicativosPage = () => {
  const { queryAplicativos } = useQueryAplicaivos();
  return (
    <>
      <Title text="Aplicativos" />
      <AsignacionAplicativosTable columns={columnsAplicativos} data={queryAplicativos.data ?? []} />
      <Outlet />
    </>
  );
};
