import { AplicativosTable } from "./data-table";
import { columnsAplicativos } from "./columns";
import { parseAsString, useQueryState } from "nuqs";
import { useQueryAplicativos } from "@/hooks/aplicativos/useQueryAplicativos";

export default function AplicativosTablePage() {
  const { queryAplicativos } = useQueryAplicativos();
  const [, setGlobalFilter] = useQueryState("search", parseAsString.withDefault(""));
  const data = queryAplicativos.data ?? [];
  return <AplicativosTable data={data} totalItems={data.length} columns={columnsAplicativos} onSearch={setGlobalFilter} />;
}
