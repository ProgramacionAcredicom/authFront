import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";

import { useDataTable } from "@/hooks/use-data-table";

import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";

interface ColaboradoresTableParams<TData extends { id: string | number }, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

export function ColaboradoresTable<TData extends { id: string | number }, TValue>({
  data,
  totalItems,
  columns,
  onSearch,
  isLoading,
}: ColaboradoresTableParams<TData, TValue>) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);
  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500,
    onGlobalFilterChange: onSearch,
  });
  return (
    <DataTable table={table} isLoading={isLoading} clickRow>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
