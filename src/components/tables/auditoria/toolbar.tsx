import type { Table } from "@tanstack/react-table";

import { MovementDatePicker } from "@/app/admin/movimientos-registro/movement-date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTableViewOptions } from "@/components/ui/table/data-table-view-options";
import type { AuditLogRow } from "@/interfaces/auditoria.interfaces";
import { Download, X } from "lucide-react";

interface AuditoriaTableToolbarProps {
  table: Table<AuditLogRow>;
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
}

export function AuditoriaTableToolbar({
  table,
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
}: AuditoriaTableToolbarProps) {
  const searchValue = (table.getState().globalFilter as string) ?? "";
  const hasFilters =
    Boolean(searchValue) ||
    Boolean(filters.action) ||
    Boolean(filters.module) ||
    Boolean(filters.resourceType) ||
    Boolean(filters.success);

  return (
    <div role="toolbar" aria-orientation="horizontal" className="flex w-full min-w-0 flex-col gap-2 p-1">
      <div className="flex min-w-0 flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 xl:flex-row xl:flex-wrap xl:items-end">
          <Input
            placeholder="Buscar actor, recurso o ruta..."
            value={searchValue}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-full xl:w-[15rem] xl:min-w-[15rem] xl:flex-none"
          />

          <div className="flex w-full flex-col gap-1 xl:w-[11rem] xl:min-w-[11rem] xl:flex-none">
            <span className="text-xs font-medium text-muted-foreground">Inicio</span>
            <MovementDatePicker id="audit-toolbar-from" value={filters.fechaInicio} onChange={onFromDateChange} className="h-8 w-full" ariaLabel="Fecha inicio de auditoria" />
          </div>

          <div className="flex w-full flex-col gap-1 xl:w-[11rem] xl:min-w-[11rem] xl:flex-none">
            <span className="text-xs font-medium text-muted-foreground">Fin</span>
            <MovementDatePicker id="audit-toolbar-to" value={filters.fechaFin} onChange={onToDateChange} className="h-8 w-full" ariaLabel="Fecha fin de auditoria" />
          </div>

          <ToolbarSelect label="Acción" value={filters.action} placeholder="Todas" options={actionOptions} onValueChange={onActionChange} />
          <ToolbarSelect label="Módulo" value={filters.module} placeholder="Todos" options={moduleOptions} onValueChange={onModuleChange} />
          <ToolbarSelect label="Recurso" value={filters.resourceType} placeholder="Todos" options={resourceTypeOptions} onValueChange={onResourceTypeChange} />
          <ToolbarSelect label="Resultado" value={filters.success} placeholder="Todos" options={successOptions} onValueChange={onSuccessChange} />

          {hasFilters ? (
            <Button
              aria-label="Reset filters"
              variant="outline"
              size="sm"
              className="h-8 border-dashed xl:mb-0.5 xl:flex-none"
              onClick={() => {
                table.setGlobalFilter("");
                onActionChange("");
                onModuleChange("");
                onResourceTypeChange("");
                onSuccessChange("");
              }}
            >
              <X />
              Limpiar
            </Button>
          ) : null}
        </div>

        <div className="flex w-full items-center justify-end gap-2 xl:ml-auto xl:w-auto">
          <Button type="button" variant="outline" size="sm" className="h-8" onClick={onExport} disabled={exportDisabled}>
            <Download />
            Descargar bitácora
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}

function ToolbarSelect({
  label,
  value,
  placeholder,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-1 xl:w-[11rem] xl:min-w-[11rem] xl:flex-none">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={value || "all"} onValueChange={(nextValue) => onValueChange(nextValue === "all" ? "" : nextValue)}>
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
