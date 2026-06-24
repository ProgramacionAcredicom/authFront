import { AlertTriangle, ArrowLeft, CalendarDays, FileSearch, Loader2, ShieldAlert, UserRound, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Link, useParams } from "react-router-dom";

import { MiAccesoStatusBadge } from "@/app/admin/mis-solicitudes/mi-acceso-status-badge";
import { getAccessRequestTypeDisplay } from "@/app/admin/mis-solicitudes/mi-acceso.utils";
import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useQueryMiAccesoRequest } from "@/hooks/mi-acceso/useQueryMiAccesoRequest";
import type { AccessRequestDetailApi, UserBriefApi } from "@/interfaces/mi-acceso.interfaces";

type DetailVariant = "my-requests" | "admin";

interface MiAccesoRequestDetailPageProps {
  variant: DetailVariant;
}

const variantContent: Record<DetailVariant, { backTo: string; backLabel: string; description: string }> = {
  "my-requests": {
    backTo: "/mi-acceso",
    backLabel: "Volver a Mis solicitudes",
    description: "Detalle completo de la solicitud para consultar la información reportada y los accesos requeridos.",
  },
  admin: {
    backTo: "/mi-acceso/administracion-solicitudes",
    backLabel: "Volver a Administración de solicitudes",
    description: "Vista administrativa del detalle de la solicitud con el contexto completo del requerimiento.",
  },
};

const absenceTypeLabels: Record<string, string> = {
  suspension: "Suspensión",
  bloqueo_vacaciones: "Bloqueo por vacaciones",
};

function getErrorStatus(error: unknown) {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined;
  }

  const status = (error as { response?: { status?: number } }).response?.status;
  return typeof status === "number" ? status : undefined;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Sin información";
  }

  try {
    return format(parseISO(value), "dd MMM yyyy, HH:mm", { locale: es });
  } catch {
    return value;
  }
}

function formatDateValue(value: string | null | undefined) {
  if (!value) {
    return "Sin información";
  }

  try {
    return format(parseISO(value), "dd MMM yyyy", { locale: es });
  } catch {
    return value;
  }
}

function getDisplayValue(value: string | null | undefined, fallback = "Sin información") {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}

function PersonSummary({
  label,
  user,
  emptyMessage,
}: {
  label: string;
  user: UserBriefApi | null;
  emptyMessage: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      {user ? (
        <div className="mt-3 space-y-1">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          <p className="text-sm text-muted-foreground">{user.role_name || "Sin puesto"}</p>
          <p className="text-sm text-muted-foreground">{user.agency_name || "Sin agencia"}</p>
          <p className="text-sm text-muted-foreground">{user.area_name || "Sin área"}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
}

function DetailField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof CalendarDays;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        <span>{label}</span>
      </div>
      <p className="text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}

function SystemsSection({ request }: { request: AccessRequestDetailApi }) {
  const systemLines = Array.isArray(request.system_lines) ? request.system_lines : [];

  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          Accesos solicitados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {systemLines.length > 0 ? (
          <div className="grid gap-4">
            {systemLines.map((systemLine) => (
              <div key={systemLine.id} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{systemLine.system.name}</p>
                  <p className="text-sm text-muted-foreground">{systemLine.system.code}</p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <DetailField
                    label="Usuario de referencia"
                    value={systemLine.reference_user ? `${systemLine.reference_user.name} (@${systemLine.reference_user.username})` : "Sin referencia"}
                  />
                  <DetailField
                    label="Observación de acceso"
                    value={getDisplayValue(systemLine.access_observation, "Sin observación")}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/70 bg-muted/15 p-6 text-sm text-muted-foreground">
            La solicitud no incluye líneas de acceso registradas.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MiAccesoRequestDetailPage({ variant }: MiAccesoRequestDetailPageProps) {
  const { id } = useParams();
  const requestId = Number(id);
  const isValidId = Number.isInteger(requestId) && requestId > 0;
  const { backTo, backLabel, description } = variantContent[variant];
  const requestQuery = useQueryMiAccesoRequest(isValidId ? requestId : null, isValidId);
  const errorStatus = getErrorStatus(requestQuery.error);
  const request = requestQuery.data;

  return (
    <PageShell>
      <PageIntro
        title={(
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">Detalle de solicitud</p>
              <h1 className="text-2xl font-semibold tracking-tight">{request?.code || "Solicitud"}</h1>
            </div>
            {request ? <MiAccesoStatusBadge status={request.status} /> : null}
          </div>
        )}
        description={request ? `${getAccessRequestTypeDisplay(request)} · ${description}` : description}
        actions={(
          <Button asChild variant="outline">
            <Link to={backTo}>
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              {backLabel}
            </Link>
          </Button>
        )}
      />

      {!isValidId ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileSearch aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Solicitud inválida</EmptyTitle>
            <EmptyDescription>El identificador de la solicitud no tiene un formato válido.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : requestQuery.isLoading ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Loader2 className="animate-spin" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Cargando detalle de la solicitud</EmptyTitle>
            <EmptyDescription>Estamos consultando la información completa del requerimiento.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : requestQuery.isError && errorStatus === 404 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileSearch aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Solicitud no encontrada</EmptyTitle>
            <EmptyDescription>No encontramos una solicitud asociada al identificador indicado.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : requestQuery.isError && errorStatus === 403 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldAlert aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Sin permiso para ver esta solicitud</EmptyTitle>
            <EmptyDescription>No tenés acceso para consultar el detalle completo de este requerimiento.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : requestQuery.isError ? (
        <Alert variant="destructive">
          <AlertTriangle aria-hidden="true" />
          <AlertTitle>Error al cargar la solicitud</AlertTitle>
          <AlertDescription>
            {requestQuery.error instanceof Error ? requestQuery.error.message : "No se pudo obtener el detalle de la solicitud."}
          </AlertDescription>
        </Alert>
      ) : request ? (
        <div className="grid gap-4">
          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
                Resumen general
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailField label="Tipo de solicitud" value={getAccessRequestTypeDisplay(request)} />
              <DetailField label="Creada el" value={formatDateTime(request.created_at)} icon={CalendarDays} />
              <DetailField label="Actualizada el" value={formatDateTime(request.updated_at)} icon={CalendarDays} />
              <DetailField label="Rango solicitado" value={`${formatDateValue(request.start_date)} — ${formatDateValue(request.end_date)}`} />
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserRound className="h-5 w-5 text-primary" aria-hidden="true" />
                Personas involucradas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
              <PersonSummary label="Solicitante" user={request.requester} emptyMessage="Sin solicitante registrado." />
              <PersonSummary label="Colaborador" user={request.subject} emptyMessage="Sin colaborador registrado." />
              <PersonSummary label="Jefe inmediato" user={request.boss} emptyMessage="Sin jefe inmediato registrado." />
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Detalle de la solicitud</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <DetailField label="Resumen generado" value={getDisplayValue(request.detail_summary, "Sin resumen disponible")} />
              <DetailField
                label="Tipo de ausencia"
                value={request.absence_type ? (absenceTypeLabels[request.absence_type] ?? request.absence_type) : "No aplica"}
              />
              <DetailField label="Detalle adicional" value={getDisplayValue(request.additional_detail, "Sin detalle adicional")} />
              <DetailField label="Motivo" value={getDisplayValue(request.reason, "Sin motivo registrado")} />
            </CardContent>
          </Card>

          <SystemsSection request={request} />
        </div>
      ) : (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileSearch aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>Sin información disponible</EmptyTitle>
            <EmptyDescription>La solicitud no devolvió datos para renderizar el detalle.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </PageShell>
  );
}
