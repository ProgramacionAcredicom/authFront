import { Suspense } from "react";
import { Title } from "@/components/title/Title";
import ColaboradoresTable from "@/components/tables/colaboradores/page";

export const ColaboradoresPage = () => {
  return (
    <>
      <Title text="Colaboradores" />
      <Suspense fallback={<div>Loading...</div>}>
        <ColaboradoresTable />
      </Suspense>
    </>
  );
};
