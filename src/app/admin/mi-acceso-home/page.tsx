"use client";

import { useMemo } from "react";
import { FileText, FolderKey, PlusCircle } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useMutationDownloadMiAccesoPdf } from "@/hooks/mi-acceso/useMutationDownloadMiAccesoPdf";
import { useQueryMiAccesoRequests } from "@/hooks/mi-acceso/useQueryMiAccesoRequests";
import { PAGINATION } from "@/config/constants";
import { getMiAccesoColumns } from "./columns";
import { MiAccesoTable } from "./data-table";
import { mapAccessRequestDetailToMiAccesoRequest } from "./mi-acceso.utils";

export default function MiAccesoPage() {
  const [pageSize] = useQueryState("perPage", parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE));
  const [pageIndex] = useQueryState("page", parseAsInteger.withDefault(1));
  const [globalFilter] = useQueryState("search", parseAsString.withDefault(""));

  const requestsQuery = useQueryMiAccesoRequests({
    page: pageIndex,
    page_size: pageSize,
    search: globalFilter.trim() || undefined,
  });
  const downloadPdfMutation = useMutationDownloadMiAccesoPdf();

  const requests = useMemo(() => requestsQuery.data?.results.map(mapAccessRequestDetailToMiAccesoRequest) ?? [], [requestsQuery.data]);
  const columns = useMemo(
    () =>
      getMiAccesoColumns({
        downloadingRequestId: downloadPdfMutation.variables?.id ?? null,
        isDownloadingPdf: downloadPdfMutation.isPending,
        onDownloadPdf: (request) => {
          if (typeof request.id !== "number") {
            return;
          }

          downloadPdfMutation.mutate({ id: request.id, code: request.code });
        },
      }),
    [downloadPdfMutation],
  );
  const totalItems = requestsQuery.data?.count ?? requestsQuery.data?.total ?? requests.length;
  const hasActiveSearch = globalFilter.trim().length > 0;
  const hasRequests = requests.length > 0;

  return (
    <PageShell contentClassName="max-w-6xl gap-6">
      <PageIntro
        title={<h1 className="text-2xl font-semibold tracking-tight">Mis solicitudes</h1>}
        description="Historial y seguimiento de tus requerimientos de alta y baja de accesos."
        actions={
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
        }
      />
      {requestsQuery.isError ? (
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
            <EmptyDescription>Creá tu primera solicitud de alta o baja desde el botón superior.</EmptyDescription>
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
