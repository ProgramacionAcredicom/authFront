import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";

interface PermisosTableParams<TData extends { id: string | number }, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
}

export function PermisosTable<TData extends { id: string | number }, TValue>({
  data,
  totalItems,
  columns,
  isLoading,
}: PermisosTableParams<TData, TValue>) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const pageCount = Math.ceil(totalItems / pageSize);
  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount > 0 ? pageCount : 1,
    shallow: false,
    debounceMs: 500,
  });

  return (
    <DataTable table={table} isLoading={isLoading}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

