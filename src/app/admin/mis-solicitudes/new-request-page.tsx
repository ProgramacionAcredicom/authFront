"use client";

import { useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Save, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";

import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { useHasPermission } from "@/hooks/auth/usePermissionAccess";
import { useMutationCreateMiAccesoRequest } from "@/hooks/mi-acceso/useMutationCreateMiAccesoRequest";
import { useQueryAccessSystems } from "@/hooks/mi-acceso/useQueryAccessSystems";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";
import { MI_ACCESO_TYPE_LABELS } from "./mi-acceso.constants";
import { MiAccesoCollaboratorSelect } from "./mi-acceso-collaborator-select";
import { createEmptySystemAccess } from "./mi-acceso.utils";
import type { MiAccesoCollaborator, MiAccesoRequestType, MiAccesoSystemAccess } from "./mi-acceso.types";

interface MiAccesoRequestFormValues {
  type: MiAccesoRequestType;
  collaborator: MiAccesoCollaborator | null;
  manager: MiAccesoCollaborator | null;
  systems: MiAccesoSystemAccess[];
  additionalRequirement: string;
}

function SelectionCard({ collaborator, emptyText }: { collaborator: MiAccesoCollaborator | null; emptyText: string }) {
  if (!collaborator) {
    return <div className="bg-muted/20 text-muted-foreground rounded-xl border border-dashed p-4 text-sm">{emptyText}</div>;
  }

  return (
    <div className="bg-muted/20 rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <div className="bg-background rounded-lg p-2">
          <UserRound className="text-muted-foreground size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div>
            <p className="text-foreground font-medium text-sm">{collaborator.name}</p>
            <p className="text-muted-foreground text-xs lowercase">@{collaborator.username}</p>
          </div>
          <div className="text-muted-foreground grid gap-2 text-xs">
            <span className="flex items-center gap-2">
              {collaborator.position}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeOptionButton({ active, type, onClick }: { active: boolean; type: MiAccesoRequestType; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-h-24 flex-col items-start justify-center rounded-xl border px-4 py-3 text-left transition-colors",
        active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
      )}
    >
      <span className="text-foreground text-base font-semibold">{MI_ACCESO_TYPE_LABELS[type]}</span>
      <span className="text-muted-foreground mt-1 text-sm">
        {type === "alta" ? "Nuevo ingreso o habilitación de accesos." : "Retiro o revocación de accesos."}
      </span>
    </button>
  );
}

export default function MiAccesoNewRequestPage() {
  const navigate = useNavigate();
  const createRequestMutation = useMutationCreateMiAccesoRequest();
  const { hasPermission: canListAccessSystems } = useHasPermission(OAUTH_PERMISSIONS.LIST_ACCESS_SYSTEMS);
  const accessSystemsQuery = useQueryAccessSystems({ is_active: true, system_kind: "form" }, { enabled: canListAccessSystems });
  const availableSystems = useMemo(() => accessSystemsQuery.data?.results ?? [], [accessSystemsQuery.data]);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MiAccesoRequestFormValues>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      type: "alta",
      collaborator: null,
      manager: null,
      systems: [],
      additionalRequirement: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "systems",
  });

  const collaborator = useWatch({ control, name: "collaborator" });
  const manager = useWatch({ control, name: "manager" });
  const additionalRequirement = useWatch({ control, name: "additionalRequirement", defaultValue: "" });
  const selectedType = useWatch({ control, name: "type" });
  const selectedSystems = useWatch({ control, name: "systems", defaultValue: [] });
  const selectedSystemIds = useMemo(
    () => new Set(selectedSystems.map((system) => system.systemId).filter((systemId): systemId is number => typeof systemId === "number")),
    [selectedSystems],
  );

  const getAvailableSystemsForIndex = (index: number) => {
    const currentSystemId = selectedSystems[index]?.systemId;
    const selectedSystemsByOtherRows = new Set(
      selectedSystems
        .filter((_, itemIndex) => itemIndex !== index)
        .map((system) => system.systemId)
        .filter((systemId): systemId is number => typeof systemId === "number"),
    );

    return availableSystems.filter((system) => system.id === currentSystemId || !selectedSystemsByOtherRows.has(system.id));
  };

  const hasAvailableSystemsToAppend = selectedSystemIds.size < availableSystems.length;

  const onSubmit = async (values: MiAccesoRequestFormValues) => {
    await createRequestMutation.mutateAsync({
      request_type: values.type,
      subject_user_id: (values.collaborator as MiAccesoCollaborator).id,
      boss_user_id: (values.manager as MiAccesoCollaborator).id,
      additional_detail: values.additionalRequirement.trim(),
      systems: values.systems.map((system, index) => ({
        system_id: system.systemId as number,
        reference_user_id: system.reference?.id ?? null,
        access_observation: system.observation.trim(),
        sort_order: index,
      })),
    });

    toast.success("Solicitud registrada", {
      description: "La solicitud fue registrada correctamente en Mi Acceso.",
    });
    navigate("/mi-acceso");
  };

  return (
    <PageShell contentClassName="max-w-6xl gap-6">
      <PageIntro
        title={<h1 className="text-2xl font-semibold tracking-tight">Nueva solicitud de acceso</h1>}
        description="Completá la solicitud de alta o baja manteniendo el flujo visual actual del proyecto."
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
          <CardHeader className="border-b pb-2!">
            <CardTitle>Tipo de requerimiento</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <FieldGroup>
              <FieldSet>
                <FieldLegend variant="label">Seleccioná el tipo de solicitud</FieldLegend>
                <div className="grid gap-4 md:grid-cols-2">
                  <TypeOptionButton active={selectedType === "alta"} type="alta" onClick={() => setValue("type", "alta")} />
                  <TypeOptionButton active={selectedType === "baja"} type="baja" onClick={() => setValue("type", "baja")} />
                </div>
              </FieldSet>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader className="border-b pb-2!">
              <CardTitle>Colaborador</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <FieldGroup className="gap-2">
                <Field data-invalid={errors.collaborator ? true : undefined}>
                  <FieldLabel htmlFor="mi-acceso-collaborator">Seleccione colaborador *</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={control}
                      name="collaborator"
                      rules={{ required: "Selecciona un colaborador." }}
                      render={({ field }) => (
                        <MiAccesoCollaboratorSelect
                          id="mi-acceso-collaborator"
                          ariaLabel="Seleccionar colaborador solicitante"
                          value={field.value}
                          onChange={field.onChange}
                          className={errors.collaborator ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                        />
                      )}
                    />
                    <FieldError>{errors.collaborator?.message}</FieldError>
                  </FieldContent>
                </Field>

                <SelectionCard collaborator={collaborator} emptyText="Al seleccionar el colaborador se mostrará su puesto." />
              </FieldGroup>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b pb-2!">
              <CardTitle>Jefe inmediato</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
              <FieldGroup className="gap-2">
                <Field data-invalid={errors.manager ? true : undefined}>
                  <FieldLabel htmlFor="mi-acceso-manager">Seleccione jefe inmediato *</FieldLabel>
                  <FieldContent>
                    <Controller
                      control={control}
                      name="manager"
                      rules={{ required: "Selecciona un jefe inmediato." }}
                      render={({ field }) => (
                        <MiAccesoCollaboratorSelect
                          id="mi-acceso-manager"
                          ariaLabel="Seleccionar jefe inmediato"
                          value={field.value}
                          onChange={field.onChange}
                          className={errors.manager ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                        />
                      )}
                    />
                    <FieldError>{errors.manager?.message}</FieldError>
                  </FieldContent>
                </Field>

                <SelectionCard collaborator={manager} emptyText="Todavía no hay jefe inmediato seleccionado." />
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-2!">
            <CardTitle>Permisos para sistemas</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="flex flex-col gap-4">
              {fields.length === 0 ? (
                <div className="bg-muted/20 text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
                  Agregá sistemas solo cuando realmente los necesités para esta solicitud.
                </div>
              ) : null}

              {fields.map((field, index) => {
                const rowSystems = getAvailableSystemsForIndex(index);

                return (
                  <Card key={field.id} className="overflow-hidden">
                    <CardHeader className="border-b pb-2!">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-base">Sistema {index + 1}</CardTitle>
                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} aria-label={`Eliminar sistema ${index + 1}`}>
                          <Trash2 data-icon="inline-start" aria-hidden="true" />
                          Eliminar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-3 space-y-3">
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <Field data-invalid={errors.systems?.[index]?.systemId ? true : undefined}>
                          <FieldLabel htmlFor={`system-name-${index}`}>Sistema *</FieldLabel>
                          <FieldContent>
                            <Controller
                              control={control}
                              name={`systems.${index}.systemId`}
                              rules={{ required: "Selecciona un sistema." }}
                              render={({ field }) => (
                                <Select
                                  value={field.value ? String(field.value) : ""}
                                  onValueChange={(value) => {
                                    const selectedSystem = availableSystems.find((system) => system.id === Number(value));
                                    field.onChange(Number(value));
                                    setValue(`systems.${index}.systemName`, selectedSystem?.name ?? "", {
                                      shouldDirty: true,
                                      shouldValidate: false,
                                    });
                                  }}
                                >
                                  <SelectTrigger
                                    id={`system-name-${index}`}
                                    aria-invalid={!!errors.systems?.[index]?.systemId}
                                    className={cn(
                                      "w-full",
                                      errors.systems?.[index]?.systemId ? "border-destructive focus-visible:ring-destructive/40" : undefined,
                                    )}
                                    disabled={!canListAccessSystems || accessSystemsQuery.isLoading || accessSystemsQuery.isError}
                                  >
                                    <SelectValue placeholder={canListAccessSystems ? "Seleccionar sistema" : "Sin permiso para listar sistemas"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {rowSystems.map((system) => (
                                      <SelectItem key={system.id} value={String(system.id)}>
                                        {system.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              />
                            {!canListAccessSystems ? (
                              <FieldDescription className="text-muted-foreground">No tienes permisos para listar sistemas de acceso.</FieldDescription>
                            ) : accessSystemsQuery.isError ? (
                              <FieldDescription className="text-destructive">No se pudieron cargar los sistemas disponibles.</FieldDescription>
                            ) : null}
                            <FieldError>{errors.systems?.[index]?.systemId?.message}</FieldError>
                          </FieldContent>
                        </Field>

                        <Field data-invalid={errors.systems?.[index]?.reference ? true : undefined}>
                          <FieldLabel htmlFor={`reference-${index}`}>Seleccione colaborador referencia *</FieldLabel>
                          <FieldContent>
                            <Controller
                              control={control}
                              name={`systems.${index}.reference`}
                              rules={{ required: "Selecciona un colaborador de referencia." }}
                              render={({ field }) => (
                                <MiAccesoCollaboratorSelect
                                  id={`reference-${index}`}
                                  ariaLabel={`Seleccionar referencia para sistema ${index + 1}`}
                                  value={field.value}
                                  onChange={field.onChange}
                                  className={errors.systems?.[index]?.reference ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                                />
                              )}
                            />
                            <FieldError>{errors.systems?.[index]?.reference?.message}</FieldError>
                          </FieldContent>
                        </Field>
                      </div>

                      <Field data-invalid={errors.systems?.[index]?.observation ? true : undefined}>
                        <FieldLabel htmlFor={`observation-${index}`}>Observación *</FieldLabel>
                        <FieldContent>
                          <Textarea
                            id={`observation-${index}`}
                            placeholder="Describe el permiso o aclaración para este sistema."
                            aria-invalid={!!errors.systems?.[index]?.observation}
                            {...register(`systems.${index}.observation`, {
                              required: "Ingresa una observación.",
                              validate: (value) => value.trim().length > 0 || "Ingresa una observación.",
                            })}
                          />
                          <FieldError>{errors.systems?.[index]?.observation?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    </CardContent>
                  </Card>
                );
              })}

              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append(createEmptySystemAccess())}
                  disabled={canListAccessSystems && !hasAvailableSystemsToAppend}
                >
                  <Plus data-icon="inline-start" aria-hidden="true" />
                  Agregar sistema
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-2!">
            <CardTitle>Requerimiento adicional</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <FieldGroup>
              <Field data-invalid={errors.additionalRequirement ? true : undefined}>
                <FieldLabel htmlFor="additionalRequirement">Detalle adicional</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="additionalRequirement"
                    placeholder="Agrega contexto adicional para la solicitud."
                    aria-invalid={!!errors.additionalRequirement}
                    {...register("additionalRequirement", {
                      maxLength: {
                        value: 500,
                        message: "El requerimiento adicional no puede exceder 500 caracteres.",
                      },
                    })}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <FieldDescription>Campo opcional con un máximo de 500 caracteres.</FieldDescription>
                    <span className="text-muted-foreground text-xs">{additionalRequirement.length}/500</span>
                  </div>
                  <FieldError>{errors.additionalRequirement?.message}</FieldError>
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button asChild type="button" variant="outline">
            <Link to="/mi-acceso">Cancelar</Link>
          </Button>
          <Button type="submit" variant="custom2" disabled={isSubmitting || createRequestMutation.isPending}>
            {createRequestMutation.isPending ? (
              <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />
            ) : (
              <Save data-icon="inline-start" aria-hidden="true" />
            )}
            Guardar solicitud
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
