import { DataTableAgencias } from "@/components/tables/agencias/data-table";
// import { Title } from "@/components/title/Title";
import { columns } from "@/components/tables/agencias/columns";
import { PageShell } from "@/components/layout/page-shell";

export const AgenciasPage = () => {
  return (
    <PageShell>
      {/* <Title text="Agencias" /> */}
      <DataTableAgencias columns={columns} />
    </PageShell>
  );
};
