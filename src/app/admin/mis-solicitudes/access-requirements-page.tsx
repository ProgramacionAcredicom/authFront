"use client";

import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, CalendarRange, KeyRound, Loader2, Plus, ShieldAlert, Trash2 } from "lucide-react";
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
  systems: Array<{
    systemId: string;
    accessObservation: string;
  }>;
}

const ABSENCE_TYPE_OPTIONS: Array<{ value: AccessRequirementAbsenceType; label: string }> = [
  { value: "bloqueo_vacaciones", label: "Bloqueo por Vacaciones" },
  { value: "suspension", label: "Suspensión" },
];

const createEmptyAccessRequirementSystem = () => ({
  systemId: "",
  accessObservation: "",
});

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

  const identifier = user.cif?.trim() ? `ID: ${user.cif}` : 'SIN ID';

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
      systems: [createEmptyAccessRequirementSystem()],
    },
  });
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "systems",
  });
  const requestedSystems = useWatch({
    control,
    name: "systems",
    defaultValue: [createEmptyAccessRequirementSystem()],
  });

  const availableSystems = useMemo(() => accessSystemsQuery.data?.results ?? [], [accessSystemsQuery.data]);
  const selectedSystemIds = useMemo(
    () => requestedSystems.map((system) => system.systemId).filter((systemId) => systemId.trim().length > 0),
    [requestedSystems],
  );
  const isSubmitting = createRequestMutation.isPending;
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

  const getAvailableSystemsForIndex = (index: number) => {
    const selectedSystemsByOtherRows = new Set(
      requestedSystems
        .filter((_, itemIndex) => itemIndex !== index)
        .map((system) => system.systemId)
        .filter((systemId) => systemId.trim().length > 0),
    );

    return availableSystems.filter((system) => !selectedSystemsByOtherRows.has(String(system.id)));
  };

  const handleRemoveSystemRow = (index: number) => {
    if (fields.length === 1) {
      replace([createEmptyAccessRequirementSystem()]);
      return;
    }

    remove(index);
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
            systems: values.systems.map((system, index) => ({
              system_id: Number(system.systemId),
              reference_user_id: null,
              access_observation: system.accessObservation.trim(),
              sort_order: index,
            })),
          };

    try {
      await createRequestMutation.mutateAsync(payload);

      toast.success("Requerimiento enviado", {
        description: "La solicitud fue registrada correctamente.",
      });

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
              <TabsList variant="line" className="grid h-auto w-full grid-cols-1 p-0 sm:grid-cols-2">
                <TabsTrigger
                  value="vacaciones"
                  className="px-4 py-4 text-left text-sm whitespace-normal sm:text-base data-[state=active]:bg-custom-green/50! bg-linear-to-l from-custom-green/30 to-custom-gray/30"
                >
                  <span className="flex flex-col items-start gap-1.5">
                    <span className="font-semibold">Vacaciones / Suspensión</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="nuevo_permiso"
                  className="px-4 py-4 text-left text-sm whitespace-normal sm:text-base data-[state=active]:bg-custom-green/50! bg-linear-to-l from-custom-green/30 to-custom-gray/30"
                >
                  <span className="flex flex-col items-start gap-1.5">
                    <span className="font-semibold">Nuevos Permisos</span>
                  </span>
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
                    {fields.map((field, index) => {
                      const rowSystems = getAvailableSystemsForIndex(index);
                      const systemError = errors.systems?.[index]?.systemId;
                      const observationError = errors.systems?.[index]?.accessObservation;

                      return (
                        <div key={field.id} className="rounded-2xl border bg-muted/10 p-4">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">Sistema {index + 1}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSystemRow(index)}
                              aria-label={`Eliminar sistema ${index + 1}`}
                            >
                              <Trash2 data-icon="inline-start" aria-hidden="true" />
                              Eliminar
                            </Button>
                          </div>

                          <div className="grid gap-4 xl:grid-cols-2">
                            <Field data-invalid={systemError ? true : undefined}>
                              <FieldLabel htmlFor={`access-requirements-system-${index}`}>Selección de sistema *</FieldLabel>
                              <FieldContent>
                                <Controller
                                  control={control}
                                  name={`systems.${index}.systemId`}
                                  rules={{
                                    validate: (value) =>
                                      activeTab !== "nuevo_permiso" || value.trim().length > 0 ? true : "Selecciona un sistema.",
                                  }}
                                  render={({ field: systemField }) => (
                                    <Select value={systemField.value} onValueChange={systemField.onChange}>
                                      <SelectTrigger
                                        id={`access-requirements-system-${index}`}
                                        aria-label="Sistema para nuevo permiso"
                                        className={cn("w-full", systemError && "border-destructive focus-visible:ring-destructive/40")}
                                        disabled={!canListAccessSystems}
                                      >
                                        <SelectValue placeholder={canListAccessSystems ? "Selecciona un sistema" : "Sin permiso para listar sistemas"} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {rowSystems.map((system) => (
                                            <SelectItem key={system.id} value={String(system.id)}>
                                              {system.name}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                                <FieldError>{systemError?.message}</FieldError>
                              </FieldContent>
                            </Field>

                            <Field data-invalid={observationError ? true : undefined}>
                              <FieldLabel htmlFor={`access-requirements-observation-${index}`}>Observación de acceso *</FieldLabel>
                              <FieldContent>
                                <Textarea
                                  id={`access-requirements-observation-${index}`}
                                  aria-invalid={observationError ? true : undefined}
                                  placeholder="Ej. Necesita permisos de aprobación de alto rango."
                                  className={cn("min-h-24", observationError && "border-destructive focus-visible:ring-destructive/40")}
                                  {...register(`systems.${index}.accessObservation`, {
                                    validate: (value) =>
                                      activeTab !== "nuevo_permiso" || value.trim().length > 0 ? true : "Ingresa la observación del acceso.",
                                  })}
                                />
                                <FieldError>{observationError?.message}</FieldError>
                              </FieldContent>
                            </Field>
                          </div>
                        </div>
                      );
                    })}

                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append(createEmptyAccessRequirementSystem())}
                        disabled={!canListAccessSystems || selectedSystemIds.length >= availableSystems.length}
                      >
                        <Plus data-icon="inline-start" aria-hidden="true" />
                        Agregar sistema
                      </Button>
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
                Enviar requerimiento
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </PageShell>
  );
}
