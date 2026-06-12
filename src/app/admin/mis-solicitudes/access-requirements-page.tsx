"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getProfile } from "@/services/auth/auth.services";
import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutationCreateMiAccesoRequest } from "@/hooks/mi-acceso/useMutationCreateMiAccesoRequest";
import { useMutationDownloadMiAccesoPdf } from "@/hooks/mi-acceso/useMutationDownloadMiAccesoPdf";
import { useQueryAccessSystems } from "@/hooks/mi-acceso/useQueryAccessSystems";
import { hasAccess, OAUTH_PERMISSIONS } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { MovementDatePicker } from "@/app/admin/movimientos-registro/movement-date-picker";

type AccessRequirementTab = "vacaciones" | "nuevo_permiso";
type AccessRequirementAbsenceType = "bloqueo_vacaciones" | "suspension";

interface AccessRequirementsFormValues {
  absenceType: AccessRequirementAbsenceType;
  startDate: string;
  endDate: string;
  reason: string;
  systemId: string;
  accessObservation: string;
}

const ABSENCE_TYPE_OPTIONS: Array<{ value: AccessRequirementAbsenceType; label: string }> = [
  { value: "bloqueo_vacaciones", label: "Bloqueo por Vacaciones" },
  { value: "suspension", label: "Suspensión" },
];

function RequesterSummaryCard({
  isLoading,
  user,
}: {
  isLoading: boolean;
  user:
    | {
        id: number;
        cif: string;
        name: string;
        username: string;
        agency?: { name: string };
        role?: { role: string };
      }
    | undefined
    | null;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 rounded-2xl border bg-muted/20 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="space-y-3">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const identifier = user.cif?.trim() ? `CIF: ${user.cif}` : `ID: ${user.id}`;

  return (
    <div className="grid gap-4 rounded-2xl border bg-muted/20 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0 space-y-2">
        <p className="text-xs font-semibold tracking-normal text-muted-foreground uppercase">Solicitante</p>
        <div className="space-y-1">
          <h2 className="text-md font-semibold tracking-tight text-balance sm:text-sm">{user.name}</h2>
          <div className="text-muted-foreground flex flex-col gap-1 text-sm sm:text-xs md:flex-row md:flex-wrap md:items-center md:gap-2">
            <span>Puesto: {user.role?.role ?? "Sin puesto"}</span>
            <span className="hidden md:inline" aria-hidden="true">•</span>
            <span>{user.agency?.name ?? "Sin agencia"}</span>
            <span className="hidden md:inline" aria-hidden="true">•</span>
            <span className="break-all sm:break-normal">Usuario: {user.username}</span>
          </div>
        </div>
      </div>
      <Badge variant="secondary" className="justify-center self-start rounded-xl px-4 py-3 text-xs font-semibold lg:self-center">
        {identifier}
      </Badge>
    </div>
  );
}

export default function MiAccesoAccessRequirementsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AccessRequirementTab>("vacaciones");
  const createRequestMutation = useMutationCreateMiAccesoRequest();
  const downloadPdfMutation = useMutationDownloadMiAccesoPdf();
  const currentUserQuery = useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60,
  });
  const canListAccessSystems = hasAccess(currentUserQuery.data, OAUTH_PERMISSIONS.LIST_ACCESS_SYSTEMS);
  const accessSystemsQuery = useQueryAccessSystems(
    { is_active: true, system_kind: "form" },
    { enabled: activeTab === "nuevo_permiso" && canListAccessSystems },
  );

  const {
    control,
    clearErrors,
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AccessRequirementsFormValues>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      absenceType: "bloqueo_vacaciones",
      startDate: "",
      endDate: "",
      reason: "",
      systemId: "",
      accessObservation: "",
    },
  });

  const availableSystems = useMemo(() => accessSystemsQuery.data?.results ?? [], [accessSystemsQuery.data]);
  const isSubmitting = createRequestMutation.isPending || downloadPdfMutation.isPending;
  const isUserUnavailable = currentUserQuery.isError || !currentUserQuery.data;
  const isSubmitDisabled =
    isSubmitting ||
    currentUserQuery.isLoading ||
    isUserUnavailable ||
    (activeTab === "nuevo_permiso" && (!canListAccessSystems || accessSystemsQuery.isLoading || accessSystemsQuery.isError));

  const handleTabChange = (nextTab: string) => {
    setActiveTab(nextTab as AccessRequirementTab);
    clearErrors();
  };

  const onSubmit = async (values: AccessRequirementsFormValues) => {
    const currentUser = currentUserQuery.data;

    if (!currentUser?.id) {
      toast.error("No se pudo identificar al usuario actual.");
      return;
    }

    const payload =
      activeTab === "vacaciones"
        ? {
            request_type: "vacaciones" as const,
            subject_user_id: currentUser.id,
            additional_detail: "",
            absence_type: values.absenceType,
            start_date: values.startDate,
            end_date: values.endDate,
            reason: values.reason.trim(),
            systems: [],
          }
        : {
            request_type: "nuevo_permiso" as const,
            subject_user_id: currentUser.id,
            additional_detail: "",
            systems: [
              {
                system_id: Number(values.systemId),
                reference_user_id: null,
                access_observation: values.accessObservation.trim(),
                sort_order: 0,
              },
            ],
          };

    try {
      const createdRequest = await createRequestMutation.mutateAsync(payload);

      toast.success("Requerimiento enviado", {
        description: "La solicitud fue registrada correctamente. Se intentará descargar el PDF.",
      });

      if (typeof createdRequest.id === "number") {
        try {
          await downloadPdfMutation.mutateAsync({ id: createdRequest.id, code: createdRequest.code });
        } catch {
          // El hook ya maneja el toast de error; la solicitud ya fue creada.
        }
      }

      navigate("/mi-acceso");
    } catch {
      // El hook ya maneja el toast de error.
    }
  };

  return (
    <PageShell contentClassName="max-w-6xl gap-6">
      <PageIntro
        title={<h1 className="text-2xl font-semibold tracking-tight">Requerimiento Accesos</h1>}
        description="Gestioná solicitudes de vacaciones, suspensión y nuevos permisos desde un solo flujo."
        actions={
          <Button asChild variant="outline">
            <Link to="/mi-acceso">
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Volver
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col gap-2">
            {currentUserQuery.isError ? (
              <Alert variant="destructive">
                <AlertCircle aria-hidden="true" />
                <AlertTitle>No se pudo cargar el solicitante</AlertTitle>
                <AlertDescription>Recargá la página o volvé a intentar cuando el perfil esté disponible.</AlertDescription>
              </Alert>
            ) : null}

            <RequesterSummaryCard isLoading={currentUserQuery.isLoading} user={currentUserQuery.data} />

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-1 rounded-xl bg-muted/20 p-1 sm:grid-cols-2">
                <TabsTrigger
                  value="vacaciones"
                  className="min-h-12 rounded-lg px-4 py-3 text-center text-sm font-semibold whitespace-normal sm:text-base data-[state=active]:shadow-none"
                >
                  Vacaciones / Suspensión
                </TabsTrigger>
                <TabsTrigger
                  value="nuevo_permiso"
                  className="min-h-12 rounded-lg px-4 py-3 text-center text-sm font-semibold whitespace-normal sm:text-base data-[state=active]:shadow-none"
                >
                  Nuevos Permisos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vacaciones" className="mt-6">
                <FieldGroup className="gap-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)]">
                    <Field data-invalid={errors.absenceType ? true : undefined}>
                      <FieldLabel htmlFor="access-requirements-type">Seleccione tipo *</FieldLabel>
                      <FieldContent>
                        <Controller
                          control={control}
                          name="absenceType"
                          rules={{
                            validate: (value) =>
                              activeTab !== "vacaciones" || value ? true : "Selecciona el tipo de requerimiento.",
                          }}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger
                                id="access-requirements-type"
                                aria-label="Tipo de vacaciones o suspensión"
                                className={cn("w-full", errors.absenceType && "border-destructive focus-visible:ring-destructive/40")}
                              >
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {ABSENCE_TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError>{errors.absenceType?.message}</FieldError>
                      </FieldContent>
                    </Field>

                    <Field data-invalid={errors.startDate ? true : undefined}>
                      <FieldLabel htmlFor="access-requirements-start-date">Fecha inicio *</FieldLabel>
                      <FieldContent>
                        <Controller
                          control={control}
                          name="startDate"
                          rules={{
                            validate: (value) =>
                              activeTab !== "vacaciones" || value.trim().length > 0 ? true : "Selecciona la fecha de inicio.",
                          }}
                          render={({ field }) => (
                            <MovementDatePicker
                              id="access-requirements-start-date"
                              ariaLabel="Fecha inicio"
                              value={field.value}
                              onChange={field.onChange}
                              className={cn("w-full", errors.startDate && "border-destructive focus-visible:ring-destructive/40")}
                            />
                          )}
                        />
                        <FieldError>{errors.startDate?.message}</FieldError>
                      </FieldContent>
                    </Field>

                    <Field data-invalid={errors.endDate ? true : undefined}>
                      <FieldLabel htmlFor="access-requirements-end-date">Fecha fin *</FieldLabel>
                      <FieldContent>
                        <Controller
                          control={control}
                          name="endDate"
                          rules={{
                            validate: (value) => {
                              if (activeTab !== "vacaciones") {
                                return true;
                              }

                              if (value.trim().length === 0) {
                                return "Selecciona la fecha de fin.";
                              }

                              const startDate = getValues("startDate");
                              if (startDate && value < startDate) {
                                return "La fecha fin debe ser igual o posterior a la fecha inicio.";
                              }

                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <MovementDatePicker
                              id="access-requirements-end-date"
                              ariaLabel="Fecha fin"
                              value={field.value}
                              onChange={field.onChange}
                              className={cn("w-full", errors.endDate && "border-destructive focus-visible:ring-destructive/40")}
                            />
                          )}
                        />
                        <FieldError>{errors.endDate?.message}</FieldError>
                      </FieldContent>
                    </Field>
                  </div>

                  <Field data-invalid={errors.reason ? true : undefined}>
                    <FieldLabel htmlFor="access-requirements-reason">Motivo de solicitud *</FieldLabel>
                    <FieldContent>
                      <Textarea
                        id="access-requirements-reason"
                        aria-invalid={errors.reason ? true : undefined}
                        placeholder="Justificá detalladamente el motivo de su ausencia para la aplicación del bloqueo correspondiente..."
                        className={cn("min-h-32", errors.reason && "border-destructive focus-visible:ring-destructive/40")}
                        {...register("reason", {
                          validate: (value) =>
                            activeTab !== "vacaciones" || value.trim().length > 0 ? true : "Ingresa el motivo de la solicitud.",
                        })}
                      />
                      <FieldError>{errors.reason?.message}</FieldError>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </TabsContent>

              <TabsContent value="nuevo_permiso" className="mt-6">
                {!currentUserQuery.isLoading && !canListAccessSystems ? (
                  <Alert>
                    <ShieldAlert aria-hidden="true" />
                    <AlertTitle>Sin permisos para listar sistemas</AlertTitle>
                    <AlertDescription>Tu usuario no tiene acceso al catálogo de sistemas para solicitar nuevos permisos.</AlertDescription>
                  </Alert>
                ) : accessSystemsQuery.isError ? (
                  <Alert variant="destructive">
                    <AlertCircle aria-hidden="true" />
                    <AlertTitle>No se pudieron cargar los sistemas</AlertTitle>
                    <AlertDescription>Revisá el endpoint de sistemas de acceso e intentá nuevamente.</AlertDescription>
                  </Alert>
                ) : accessSystemsQuery.isLoading ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                  </div>
                ) : (
                  <FieldGroup className="gap-6">
                    <div className="grid gap-4 xl:grid-cols-2">
                      <Field data-invalid={errors.systemId ? true : undefined}>
                        <FieldLabel htmlFor="access-requirements-system">Selección de sistema *</FieldLabel>
                        <FieldContent>
                          <Controller
                            control={control}
                            name="systemId"
                            rules={{
                              validate: (value) =>
                                activeTab !== "nuevo_permiso" || value.trim().length > 0 ? true : "Selecciona un sistema.",
                            }}
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger
                                  id="access-requirements-system"
                                  aria-label="Sistema para nuevo permiso"
                                  className={cn("w-full", errors.systemId && "border-destructive focus-visible:ring-destructive/40")}
                                  disabled={!canListAccessSystems}
                                >
                                  <SelectValue placeholder={canListAccessSystems ? "Selecciona un sistema" : "Sin permiso para listar sistemas"} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {availableSystems.map((system) => (
                                      <SelectItem key={system.id} value={String(system.id)}>
                                        {system.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <FieldError>{errors.systemId?.message}</FieldError>
                        </FieldContent>
                      </Field>

                      <Field data-invalid={errors.accessObservation ? true : undefined}>
                        <FieldLabel htmlFor="access-requirements-observation">Observación de acceso *</FieldLabel>
                        <FieldContent>
                          <Textarea
                            id="access-requirements-observation"
                            aria-invalid={errors.accessObservation ? true : undefined}
                            placeholder="Ej. Necesita permisos de aprobación de alto rango."
                            className={cn("min-h-24", errors.accessObservation && "border-destructive focus-visible:ring-destructive/40")}
                            {...register("accessObservation", {
                              validate: (value) =>
                                activeTab !== "nuevo_permiso" || value.trim().length > 0 ? true : "Ingresa la observación del acceso.",
                            })}
                          />
                          <FieldError>{errors.accessObservation?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    </div>
                  </FieldGroup>
                )}
              </TabsContent>
            </Tabs>
            <div className="flex flex-col justify-end gap-3 sm:flex-row mt-2">
              <Button asChild variant="outline">
                <Link to="/mi-acceso">Cancelar</Link>
              </Button>
              <Button type="submit" variant="custom2" disabled={isSubmitDisabled}>
                {isSubmitting ? <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" /> : <ShieldAlert data-icon="inline-start" aria-hidden="true" />}
                Enviar requerimiento y descargar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </PageShell>
  );
}
