import { parseAsInteger, useQueryState } from "nuqs";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import type { AuditLogRow } from "@/interfaces/auditoria.interfaces";

import { AuditoriaTableToolbar } from "./toolbar";

interface AuditoriaTableProps {
  data: AuditLogRow[];
  columns: ColumnDef<AuditLogRow>[];
  isLoading?: boolean;
  filters: {
    fechaInicio: string;
    fechaFin: string;
    action: string;
    module: string;
    resourceType: string;
    success: string;
  };
  actionOptions: { label: string; value: string }[];
  moduleOptions: { label: string; value: string }[];
  resourceTypeOptions: { label: string; value: string }[];
  successOptions: { label: string; value: string }[];
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onModuleChange: (value: string) => void;
  onResourceTypeChange: (value: string) => void;
  onSuccessChange: (value: string) => void;
  onExport: () => void;
  exportDisabled?: boolean;
  emptyMessage?: string;
}

export function AuditoriaTable({
  data,
  columns,
  isLoading,
  filters,
  actionOptions,
  moduleOptions,
  resourceTypeOptions,
  successOptions,
  onFromDateChange,
  onToDateChange,
  onActionChange,
  onModuleChange,
  onResourceTypeChange,
  onSuccessChange,
  onExport,
  exportDisabled,
  emptyMessage,
}: AuditoriaTableProps) {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
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
    <DataTable
      table={table}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      internalScrollLayout
      className="min-h-0 flex-1"
      tableWrapperClassName="min-h-0 flex-1 rounded-lg border bg-background"
      toolbarClassName="px-2 py-1"
      scrollContainerClassName="min-h-0 flex-1 overflow-auto"
      footerClassName="px-2 py-1"
    >
      <div className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <AuditoriaTableToolbar
          table={table}
          filters={filters}
          actionOptions={actionOptions}
          moduleOptions={moduleOptions}
          resourceTypeOptions={resourceTypeOptions}
          successOptions={successOptions}
          onFromDateChange={onFromDateChange}
          onToDateChange={onToDateChange}
          onActionChange={onActionChange}
          onModuleChange={onModuleChange}
          onResourceTypeChange={onResourceTypeChange}
          onSuccessChange={onSuccessChange}
          onExport={onExport}
          exportDisabled={exportDisabled}
        />
      </div>
    </DataTable>
  );
}
