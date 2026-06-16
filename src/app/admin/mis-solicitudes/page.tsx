"use client";

import { useMemo } from "react";
import { FileText, FolderKey, PlusCircle, ShieldAlert } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useInfoUserQuery } from "@/hooks/auth/usePermissionAccess";
import { useMutationDownloadMiAccesoPdf } from "@/hooks/mi-acceso/useMutationDownloadMiAccesoPdf";
import { useQueryMiAccesoRequests } from "@/hooks/mi-acceso/useQueryMiAccesoRequests";
import { PAGINATION } from "@/config/constants";
import { hasAccess, OAUTH_PERMISSIONS } from "@/lib/permissions";
import { getMiAccesoColumns } from "./columns";
import { MiAccesoTable } from "./data-table";
import { mapAccessRequestDetailToMiAccesoRequest } from "./mi-acceso.utils";

export default function MiAccesoPage() {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE));
  const [pageIndex] = useQueryState("page", parseAsInteger.withDefault(1));
  const [globalFilter] = useQueryState("search", parseAsString.withDefault(""));
  const userQuery = useInfoUserQuery();
  const canAccessMyRequests = hasAccess(userQuery.data, OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS);
  const canCreateRequest = hasAccess(userQuery.data, OAUTH_PERMISSIONS.CREATE_ACCESS_REQUEST);
  const canViewRequest = hasAccess(userQuery.data, OAUTH_PERMISSIONS.VIEW_ACCESS_REQUEST);

  const requestsQuery = useQueryMiAccesoRequests({
    page: pageIndex,
    page_size: pageSize,
    search: globalFilter.trim() || undefined,
  }, {
    enabled: canAccessMyRequests,
  });
  const downloadPdfMutation = useMutationDownloadMiAccesoPdf();

  const requests = useMemo(() => requestsQuery.data?.results.map(mapAccessRequestDetailToMiAccesoRequest) ?? [], [requestsQuery.data]);
  const columns = useMemo(
    () =>
      getMiAccesoColumns({
        canViewRequestPdf: canViewRequest,
        downloadingRequestId: downloadPdfMutation.variables?.id ?? null,
        isDownloadingPdf: downloadPdfMutation.isPending,
        onDownloadPdf: (request) => {
          if (typeof request.id !== "number") {
            return;
          }

          downloadPdfMutation.mutate({ id: request.id, code: request.code });
        },
      }),
    [canViewRequest, downloadPdfMutation],
  );
  const totalItems = requestsQuery.data?.count ?? requestsQuery.data?.total ?? requests.length;
  const hasActiveSearch = globalFilter.trim().length > 0;
  const hasRequests = requests.length > 0;
  const isLoadingPermissions = userQuery.isLoading;
  const showCreationActions = canCreateRequest;

  return (
    <PageShell>
      <PageIntro
        title={<h1 className="text-2xl font-semibold tracking-tight">Mis solicitudes</h1>}
        description="Historial y seguimiento de tus requerimientos de alta y baja de accesos."
        actions={showCreationActions ? (
          <>
            <Button asChild variant="custom2">
              <Link to="/mi-acceso/requerimiento-accesos">
                <FolderKey data-icon="inline-start" aria-hidden="true" />
                Requerimiento Accesos
              </Link>
            </Button>
            <Button asChild variant="custom2">
              <Link to="/mi-acceso/nueva">
                <PlusCircle data-icon="inline-start" aria-hidden="true" />
                Nueva solicitud
              </Link>
            </Button>
          </>
        ) : undefined}
      />
      {isLoadingPermissions ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Cargando permisos de solicitudes</EmptyTitle>
            <EmptyDescription>Estamos validando qué acciones tenés disponibles en Mi Acceso.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : !canAccessMyRequests ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldAlert aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Sin permisos para consultar solicitudes</EmptyTitle>
            <EmptyDescription>No tenés permiso para consultar la bandeja de tus solicitudes de acceso.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : requestsQuery.isError ? (
        <Alert variant="destructive">
          <AlertTitle>Error al cargar solicitudes</AlertTitle>
          <AlertDescription>
            {requestsQuery.error instanceof Error ? requestsQuery.error.message : "No se pudieron cargar las solicitudes de Mi Acceso."}
          </AlertDescription>
        </Alert>
      ) : !requestsQuery.isLoading && !hasRequests && !hasActiveSearch ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No hay solicitudes registradas</EmptyTitle>
            <EmptyDescription>
              {showCreationActions
                ? "Creá tu primera solicitud de alta o baja desde el botón superior."
                : "Todavía no tenés solicitudes registradas."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <MiAccesoTable
          data={requests}
          totalItems={totalItems}
          columns={columns}
          isLoading={requestsQuery.isLoading || requestsQuery.isFetching}
          emptyMessage={hasActiveSearch ? "No se encontraron solicitudes." : "No hay solicitudes registradas."}
        />
      )}
    </PageShell>
  );
}
