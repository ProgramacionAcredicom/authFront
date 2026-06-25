import { AlertTriangle, FileSearch, ShieldAlert } from "lucide-react";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";

import type { MiAccesoRequestStatus, MiAccesoRequestType } from "@/app/admin/mis-solicitudes/mi-acceso.types";
import { MI_ACCESO_STATUS_LABELS, MI_ACCESO_TYPE_LABELS } from "@/app/admin/mis-solicitudes/mi-acceso.constants";
import { PAGINATION } from "@/config/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useInfoUserQuery } from "@/hooks/auth/usePermissionAccess";
import { useMutationDownloadMiAccesoPdf } from "@/hooks/mi-acceso/useMutationDownloadMiAccesoPdf";
import { useMutationUpdateMiAccesoRequestStatus } from "@/hooks/mi-acceso/useMutationUpdateMiAccesoRequestStatus";
import { getSortingStateParser } from "@/lib/parsers";
import { hasAccess, OAUTH_PERMISSIONS } from "@/lib/permissions";
import { useQueryAdminMiAccesoRequests } from "@/hooks/mi-acceso/useQueryAdminMiAccesoRequests";
import type { UpdateAccessRequestStatus } from "@/interfaces/mi-acceso.interfaces";

import { getAdminMiAccesoColumns } from "./columns";
import { MiAccesoAdministrationTable } from "./data-table";
import { MiAccesoStatusChangeDialog } from "./status-change-dialog";
import type { MiAccesoAdminRequestRow } from "./mi-acceso-administration.types";
import { getAdminRequestsOrdering, mapAccessRequestDetailToAdminRow } from "./mi-acceso-administration.utils";

const SORTABLE_COLUMNS = new Set<keyof MiAccesoAdminRequestRow>(["code", "type", "status", "createdAt"]);
const STATUS_VALUES = Object.keys(MI_ACCESO_STATUS_LABELS) as MiAccesoRequestStatus[];
const REQUEST_TYPE_VALUES = Object.keys(MI_ACCESO_TYPE_LABELS) as MiAccesoRequestType[];

function getSingleSelectValue<T extends string>(values: string[], validValues: readonly T[]): T | undefined {
  const firstValue = values[0];

  if (!firstValue || !validValues.includes(firstValue as T)) {
    return undefined;
  }

  return firstValue as T;
}

function getErrorStatus(error: unknown) {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined;
  }

  const status = (error as { response?: { status?: number } }).response?.status;
  return typeof status === "number" ? status : undefined;
}

export default function MiAccesoAdministrationPage() {
  const [requestToUpdateStatus, setRequestToUpdateStatus] = useState<MiAccesoAdminRequestRow | null>(null);
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE));
  const [pageIndex] = useQueryState("page", parseAsInteger.withDefault(1));
  const [globalFilter] = useQueryState("search", parseAsString.withDefault(""));
  const [statusFilter] = useQueryState("status", parseAsArrayOf(parseAsString, ",").withDefault([]));
  const [requestTypeFilter] = useQueryState("type", parseAsArrayOf(parseAsString, ",").withDefault([]));
  const [sorting] = useQueryState("sort", getSortingStateParser<MiAccesoAdminRequestRow>(SORTABLE_COLUMNS).withDefault([]));
  const userQuery = useInfoUserQuery();
  const canViewRequestPdf = hasAccess(userQuery.data, OAUTH_PERMISSIONS.VIEW_ACCESS_REQUEST);
  const canChangeRequestStatus = hasAccess(userQuery.data, OAUTH_PERMISSIONS.CHANGE_ACCESS_REQUEST_STATUS);

  const selectedStatus = getSingleSelectValue(statusFilter, STATUS_VALUES);
  const selectedRequestType = getSingleSelectValue(requestTypeFilter, REQUEST_TYPE_VALUES);
  const ordering = useMemo(() => getAdminRequestsOrdering(sorting), [sorting]);

  const requestsQuery = useQueryAdminMiAccesoRequests({
    page: pageIndex,
    page_size: pageSize,
    search: globalFilter.trim() || undefined,
    status: selectedStatus,
    request_type: selectedRequestType,
    ordering,
  });
  const downloadPdfMutation = useMutationDownloadMiAccesoPdf();
  const updateRequestStatusMutation = useMutationUpdateMiAccesoRequestStatus({
    onSuccess: () => {
      setRequestToUpdateStatus(null);
    },
  });

  const rows = useMemo(() => requestsQuery.data?.results.map(mapAccessRequestDetailToAdminRow) ?? [], [requestsQuery.data]);
  const handleStatusDialogOpenChange = (open: boolean) => {
    if (!open && !updateRequestStatusMutation.isPending) {
      setRequestToUpdateStatus(null);
    }
  };

  const handleChangeStatus = (status: UpdateAccessRequestStatus) => {
    if (!requestToUpdateStatus) {
      return;
    }

    updateRequestStatusMutation.mutate({
      id: requestToUpdateStatus.id,
      status,
      comment: "",
    });
  };

  const columns = useMemo(
    () =>
      getAdminMiAccesoColumns({
        canViewRequest: canViewRequestPdf,
        canChangeStatus: canChangeRequestStatus,
        downloadingRequestId: downloadPdfMutation.variables?.id ?? null,
        isDownloadingPdf: downloadPdfMutation.isPending,
        getDetailHref: (request) => `/mi-acceso/administracion-solicitudes/detalle/${request.id}`,
        onDownloadPdf: (request) => {
          downloadPdfMutation.mutate({ id: request.id, code: request.code });
        },
        onOpenStatusDialog: (request) => {
          setRequestToUpdateStatus(request);
        },
      }),
    [canViewRequestPdf, canChangeRequestStatus, downloadPdfMutation],
  );
  const totalItems = requestsQuery.data?.count ?? requestsQuery.data?.total ?? rows.length;
  const hasSearch = globalFilter.trim().length > 0;
  const hasFilters = hasSearch || statusFilter.length > 0 || requestTypeFilter.length > 0;
  const hasRequests = rows.length > 0;
  const errorStatus = getErrorStatus(requestsQuery.error);

  return (
    <PageShell>
      <PageIntro
        title={<h1 className="text-2xl font-semibold tracking-tight">Administración de solicitudes</h1>}
        description="Bandeja administrativa para consultar solicitudes."
      />

      {requestsQuery.isError && errorStatus === 403 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldAlert aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Sin permisos para administrar solicitudes</EmptyTitle>
            <EmptyDescription>
              Tu usuario no tiene acceso a la bandeja administrativa de solicitudes. Si necesitás este módulo, pedí el permiso correspondiente.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : requestsQuery.isError ? (
        <Alert variant="destructive">
          <AlertTriangle aria-hidden="true" />
          <AlertTitle>Error al cargar solicitudes</AlertTitle>
          <AlertDescription>
            {requestsQuery.error instanceof Error ? requestsQuery.error.message : "No se pudo cargar la bandeja administrativa de solicitudes."}
          </AlertDescription>
        </Alert>
      ) : !requestsQuery.isLoading && !hasRequests && !hasFilters ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileSearch aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No hay solicitudes registradas</EmptyTitle>
            <EmptyDescription>Cuando existan solicitudes en el sistema, aparecerán en esta bandeja administrativa.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <MiAccesoAdministrationTable
          data={rows}
          totalItems={totalItems}
          columns={columns}
          isLoading={requestsQuery.isLoading || requestsQuery.isFetching}
          emptyMessage={hasFilters ? "No se encontraron solicitudes con los filtros actuales." : "No hay solicitudes registradas."}
        />
      )}

      <MiAccesoStatusChangeDialog
        open={requestToUpdateStatus !== null}
        onOpenChange={handleStatusDialogOpenChange}
        request={requestToUpdateStatus}
        isPending={updateRequestStatusMutation.isPending}
        pendingStatus={updateRequestStatusMutation.variables?.status ?? null}
        onChangeStatus={handleChangeStatus}
      />
    </PageShell>
  );
}
