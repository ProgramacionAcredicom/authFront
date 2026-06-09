import type { ColumnDef } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";

import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

interface MiAccesoAdministrationTableProps<TData extends { id: string | number }, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function MiAccesoAdministrationTable<TData extends { id: string | number }, TValue>({
  data,
  totalItems,
  columns,
  isLoading,
  emptyMessage,
}: MiAccesoAdministrationTableProps<TData, TValue>) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500,
  });

  return (
    <DataTable table={table} isLoading={isLoading} emptyMessage={emptyMessage}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
