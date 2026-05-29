import { parseAsInteger, useQueryState } from "nuqs";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import type { MovementListTypeFilter, MovementLogRow, MovementLogType } from "@/interfaces/movements.interfaces";

import { MovimientosTableToolbar } from "./toolbar";

interface MovimientosTableParams {
  data: MovementLogRow[];
  totalItems: number;
  columns: ColumnDef<MovementLogRow>[];
  isLoading?: boolean;
  filters: {
    fechaInicio: string;
    fechaFin: string;
    tipos: MovementListTypeFilter;
  };
  movementTypeOptions: { label: string; value: MovementLogType }[];
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onTypeChange: (value: MovementListTypeFilter) => void;
}

export function MovimientosTable({
  data,
  totalItems,
  columns,
  isLoading,
  filters,
  movementTypeOptions,
  onFromDateChange,
  onToDateChange,
  onTypeChange,
}: MovimientosTableParams) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    debounceMs: 500,
    manualFiltering: false,
    manualSorting: false,
    manualPagination: false,
  });

  return (
    <DataTable table={table} isLoading={isLoading}>
      <MovimientosTableToolbar
        table={table}
        filters={filters}
        movementTypeOptions={movementTypeOptions}
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
        onTypeChange={onTypeChange}
      />
    </DataTable>
  );
}
