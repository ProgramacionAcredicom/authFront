import type { AuditLogRow } from "@/interfaces/auditoria.interfaces";
import { toast } from "sonner";

import { auditColumns, AUDIT_ACTION_OPTIONS, AUDIT_MODULE_OPTIONS, AUDIT_SUCCESS_OPTIONS } from "./columns";
import { AuditoriaTable } from "./data-table";
import { exportAuditoriaToXlsx } from "@/lib/export-auditoria-xlsx";

export default function AuditoriaTablePage({
  data,
  isLoading,
  filters,
  resourceTypeOptions,
  onFromDateChange,
  onToDateChange,
  onActionChange,
  onModuleChange,
  onResourceTypeChange,
  onSuccessChange,
  emptyMessage,
}: {
  data: AuditLogRow[];
  isLoading?: boolean;
  filters: {
    fechaInicio: string;
    fechaFin: string;
    action: string;
    module: string;
    resourceType: string;
    success: string;
  };
  resourceTypeOptions: { label: string; value: string }[];
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onModuleChange: (value: string) => void;
  onResourceTypeChange: (value: string) => void;
  onSuccessChange: (value: string) => void;
  emptyMessage?: string;
}) {
  const handleExport = async () => {
    if (data.length === 0) {
      toast.error("No hay registros visibles para exportar.");
      return;
    }

    try {
      await exportAuditoriaToXlsx(data);
    } catch {
      toast.error("No se pudo generar el archivo Excel de la bitácora.");
    }
  };

  return (
    <AuditoriaTable
      data={data}
      columns={auditColumns}
      isLoading={isLoading}
      filters={filters}
      actionOptions={AUDIT_ACTION_OPTIONS}
      moduleOptions={AUDIT_MODULE_OPTIONS}
      resourceTypeOptions={resourceTypeOptions}
      successOptions={AUDIT_SUCCESS_OPTIONS}
      onFromDateChange={onFromDateChange}
      onToDateChange={onToDateChange}
      onActionChange={onActionChange}
      onModuleChange={onModuleChange}
      onResourceTypeChange={onResourceTypeChange}
      onSuccessChange={onSuccessChange}
      onExport={handleExport}
      exportDisabled={isLoading || data.length === 0}
      emptyMessage={emptyMessage}
    />
  );
}
