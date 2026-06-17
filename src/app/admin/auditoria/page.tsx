import { AlertTriangle, ShieldAlert } from "lucide-react";
import { format, subDays } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

import AuditoriaTablePage from "@/components/tables/auditoria/page";
import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useQueryAuditoria } from "@/hooks/auditoria/useQueryAuditoria";
import type { AuditAction, AuditModule, AuditLogRow } from "@/interfaces/auditoria.interfaces";

type AuditSuccessFilter = "" | "true" | "false";

function getDefaultAuditRange(now = new Date()) {
  return {
    fechaInicio: format(subDays(now, 1), "yyyy-MM-dd"),
    fechaFin: format(now, "yyyy-MM-dd"),
  };
}

function getErrorStatus(error: unknown) {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined;
  }

  const status = (error as { response?: { status?: number } }).response?.status;
  return typeof status === "number" ? status : undefined;
}

function matchesSearch(row: AuditLogRow, search: string) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return true;

  return [row.actor, row.resourceLabel, row.resourceType, row.path, row.httpMethod, row.metadataSummary]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export default function AuditoriaPage() {
  const defaultRange = useMemo(() => getDefaultAuditRange(), []);
  const [fechaInicio, setFechaInicio] = useQueryState("fechaInicio", parseAsString.withDefault(defaultRange.fechaInicio));
  const [fechaFin, setFechaFin] = useQueryState("fechaFin", parseAsString.withDefault(defaultRange.fechaFin));
  const [globalFilter] = useQueryState("search", parseAsString.withDefault(""));
  const [actionFilter, setActionFilter] = useQueryState("action", parseAsString.withDefault(""));
  const [moduleFilter, setModuleFilter] = useQueryState("module", parseAsString.withDefault(""));
  const [resourceTypeFilter, setResourceTypeFilter] = useQueryState("resourceType", parseAsString.withDefault(""));
  const [successFilter, setSuccessFilter] = useQueryState("success", parseAsString.withDefault(""));

  const auditQuery = useQueryAuditoria(
    {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    },
    Boolean(fechaInicio && fechaFin),
  );

  const resourceTypeOptions = useMemo(() => {
    const uniqueValues = Array.from(new Set((auditQuery.data ?? []).map((row) => row.resourceType).filter((value) => value !== "N/A"))).sort();
    return uniqueValues.map((value) => ({ label: value, value }));
  }, [auditQuery.data]);

  const rows = useMemo(() => {
    return (auditQuery.data ?? []).filter((row) => {
      const matchesAction = !actionFilter || row.action === (actionFilter as AuditAction);
      const matchesModule = !moduleFilter || row.module === (moduleFilter as AuditModule);
      const matchesResourceType = !resourceTypeFilter || row.resourceType === resourceTypeFilter;
      const matchesSuccess =
        successFilter === ""
          ? true
          : successFilter === "true"
            ? row.success
            : !row.success;

      return matchesAction && matchesModule && matchesResourceType && matchesSuccess && matchesSearch(row, globalFilter);
    });
  }, [actionFilter, auditQuery.data, globalFilter, moduleFilter, resourceTypeFilter, successFilter]);

  const hasFilters = Boolean(globalFilter.trim() || actionFilter || moduleFilter || resourceTypeFilter || successFilter);
  const errorStatus = getErrorStatus(auditQuery.error);

  return (
    <PageShell contentClassName="max-w-full min-h-0 overflow-hidden">
      <PageIntro
        title={<h1 className="text-2xl font-semibold tracking-tight">Auditoria</h1>}
        description="Consulta el log de auditoría del sistema por rango de fechas y filtrá eventos relevantes."
      />

      {auditQuery.isError && errorStatus === 403 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldAlert aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Sin permisos para consultar auditoría</EmptyTitle>
            <EmptyDescription>Tu usuario no tiene acceso al log de auditoría. Si necesitás este módulo, solicitá el permiso correspondiente.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : auditQuery.isError ? (
        <Alert variant="destructive">
          <AlertTriangle aria-hidden="true" />
          <AlertTitle>Error al cargar auditoría</AlertTitle>
          <AlertDescription>
            {auditQuery.error instanceof Error ? auditQuery.error.message : "No se pudo cargar el log de auditoría para el rango seleccionado."}
          </AlertDescription>
        </Alert>
      ) : (
        <AuditoriaTablePage
          data={rows}
          isLoading={auditQuery.isLoading || auditQuery.isFetching}
          filters={{
            fechaInicio,
            fechaFin,
            action: actionFilter,
            module: moduleFilter,
            resourceType: resourceTypeFilter,
            success: successFilter as AuditSuccessFilter,
          }}
          resourceTypeOptions={resourceTypeOptions}
          onFromDateChange={setFechaInicio}
          onToDateChange={setFechaFin}
          onActionChange={setActionFilter}
          onModuleChange={setModuleFilter}
          onResourceTypeChange={setResourceTypeFilter}
          onSuccessChange={setSuccessFilter}
          emptyMessage={hasFilters ? "No se encontraron eventos con los filtros actuales." : "No hay eventos de auditoría en este rango."}
        />
      )}
    </PageShell>
  );
}
