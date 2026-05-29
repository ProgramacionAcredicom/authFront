import type { MovementListTypeFilter, MovementLogRow, MovementLogType } from "@/interfaces/movements.interfaces";

import { movementColumns } from "./columns";
import { MovimientosTable } from "./data-table";

export default function MovimientosTablePage({
  data,
  isLoading,
  filters,
  movementTypeOptions,
  onFromDateChange,
  onToDateChange,
  onTypeChange,
}: {
  data: MovementLogRow[];
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
}) {
  return (
    <MovimientosTable
      data={data}
      totalItems={data.length}
      columns={movementColumns}
      isLoading={isLoading}
      filters={filters}
      movementTypeOptions={movementTypeOptions}
      onFromDateChange={onFromDateChange}
      onToDateChange={onToDateChange}
      onTypeChange={onTypeChange}
    />
  );
}
