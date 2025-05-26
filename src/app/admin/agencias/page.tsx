import { DataTableAgencias } from "@/components/tables/agencias/data-table";
// import { Title } from "@/components/title/Title";
import { columns } from "@/components/tables/agencias/columns";

export const AgenciasPage = () => {
  return (
    <>
      {/* <Title text="Agencias" /> */}
      <DataTableAgencias columns={columns} />
    </>
  );
};
