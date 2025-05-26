import { useQueryColaboradores } from "@/hooks/colaboradores/useQueryColaboradores";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { columns } from "./columns";
import { ColaboradoresTable } from "./data-table";

export default function ColaboradoresTablePage() {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [pageIndex] = useQueryState("page", parseAsInteger.withDefault(1));
  const [globalFilter, setGlobalFilter] = useQueryState("search", parseAsString.withDefault(""));

  const { data } = useQueryColaboradores({ pageIndex, pageSize }, globalFilter);
  return <ColaboradoresTable data={data?.results || []} totalItems={data?.total || 0} columns={columns} onSearch={setGlobalFilter} />;
}
