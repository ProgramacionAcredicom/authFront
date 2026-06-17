import { Briefcase, Building2, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { ActionBadge } from "./action-badge";
import { CollaboratorSearchSelect } from "./collaborator-search-select";
import {
  ACTION_DESCRIPTIONS,
  type CollaboratorInfo,
  type SearchableSelectOption,
  type MovementValidationErrors,
  type Movement,
} from "./movements-data";
import { MovementDatePicker } from "./movement-date-picker";
import { SearchableSelect } from "./searchable-select";
import { generateCredentialsFromName } from "./movements-utils";

interface MovementCardProps {
  agenciesOptions: readonly SearchableSelectOption[];
  agenciesEmptyMessage?: string;
  canListAgencies?: boolean;
  index: number;
  movement: Movement;
  movementErrors?: MovementValidationErrors;
  onChange: (movement: Movement) => void;
  onRemove: () => void;
  canListPositions?: boolean;
  positionsEmptyMessage?: string;
  positionsOptions: readonly SearchableSelectOption[];
}

const NAME_ONLY_REGEX = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g;

function sanitizeName(value: string) {
  return value.replace(NAME_ONLY_REGEX, "");
}

function sanitizeDigits(value: string, maxLength?: number) {
  const digitsOnly = value.replace(/\D/g, "");
  return typeof maxLength === "number" ? digitsOnly.slice(0, maxLength) : digitsOnly;
}

export function MovementCard({
  agenciesOptions,
  agenciesEmptyMessage = "Sin agencias.",
  canListAgencies = true,
  index,
  movement,
  movementErrors = {},
  onChange,
  onRemove,
  canListPositions = true,
  positionsEmptyMessage = "Sin puestos.",
  positionsOptions,
}: MovementCardProps) {
  const isAlta = movement.actionType === "alta";
  const isMovimiento = movement.actionType === "movimiento";
  const isBaja = movement.actionType === "baja";
  const nameValue = movement.newName ?? "";
  const dpiValue = movement.newDpi ?? "";
  const employeeIdValue = movement.newId ?? "";
  const usernameValue = movement.newUsername ?? "";
  const emailValue = movement.newEmail ?? "";
  const passwordValue = movement.newPassword ?? "";
  const allowCredentialEdit = Boolean(movement.allowCredentialEdit);
  const hasCredentialConflict = allowCredentialEdit && Boolean(
    movementErrors.newUsername || movementErrors.newEmail || movementErrors.submit,
  );
  const dpiError =
    movementErrors.newDpi ||
    (isAlta && dpiValue.length > 0 && dpiValue.length !== 13
      ? "El DPI debe contener exactamente 13 dígitos numéricos."
      : "");

  const update = (patch: Partial<Movement>) => onChange({ ...movement, ...patch });

  const handleCollaboratorChange = (value: CollaboratorInfo | null) => {
    if (isMovimiento) {
      update({
        collaborator: value,
        newAgency: value?.agency ?? "",
        newPosition: value?.position ?? "",
      });
      return;
    }

    update({ collaborator: value });
  };

  const handleAltaNameChange = (value: string) => {
    const sanitizedName = sanitizeName(value);
    const previousCredentials = generateCredentialsFromName(nameValue);
    const nextCredentials = generateCredentialsFromName(sanitizedName);

    update({
      newName: sanitizedName,
      newEmail:
        !emailValue || emailValue === previousCredentials.email
          ? nextCredentials.email
          : emailValue,
      newUsername:
        !usernameValue || usernameValue === previousCredentials.username
          ? nextCredentials.username
          : usernameValue,
    });
  };

  return (
    <Card className="overflow-hidden shadow-sm transition-shadow focus-within:shadow-md">
      <CardHeader className="border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <span
              aria-hidden="true"
              className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            >
              {index + 1}
            </span>

            {isAlta ? (
              <div className="min-w-0">
                <p className="text-foreground font-medium">Nuevo colaborador</p>
                <p className="text-muted-foreground text-sm">{ACTION_DESCRIPTIONS.alta}</p>
              </div>
            ) : (
              <div className="flex min-w-1/3 flex-col items-start gap-2">
                <ActionBadge type={movement.actionType} size="sm" />

                <CollaboratorSearchSelect
                  id={`collaborator-${movement.id}`}
                  value={movement.collaborator}
                  onChange={handleCollaboratorChange}
                  className={cn(
                    "md:max-w-72",
                    movementErrors.collaborator && "border-destructive focus-visible:ring-destructive/40",
                  )}
                />
                <FieldError>{movementErrors.collaborator}</FieldError>
              </div>
            )}

            {!isAlta && movement.collaborator ? (
              <div
                aria-label="Asignación actual del colaborador"
                className="text-muted-foreground flex flex-col items-start gap-3 border-l pl-3 text-xs"
              >
                <span className="text-[10px] font-semibold tracking-wide uppercase opacity-70">Asignación actual</span>
                <span className="flex items-center gap-1.5">
                  <Building2 aria-hidden="true" className="size-4 opacity-60" />
                  <span className="text-foreground/80 font-medium">{movement.collaborator.agency}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase aria-hidden="true" className="size-4 opacity-60" />
                  <span className="text-foreground/80 font-medium">{movement.collaborator.position}</span>
                </span>
              </div>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            aria-label={`Descartar movimiento ${index + 1}`}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 data-icon="inline-start" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="py-5">
        {isAlta ? (
          <FieldGroup className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-4">
              <Field>
                <FieldLabel htmlFor={`date-${movement.id}`}>Fecha efectiva *</FieldLabel>
                <FieldContent>
                  <MovementDatePicker
                    id={`date-${movement.id}`}
                    value={movement.effectiveDate}
                    onChange={(value) => update({ effectiveDate: value })}
                  />
                  <FieldDescription>Fecha en la que tomará efecto el cambio.</FieldDescription>
                  <FieldError>{movementErrors.effectiveDate}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`name-${movement.id}`}>Nombre completo *</FieldLabel>
                <FieldContent>
                  <Input
                    aria-invalid={!!movementErrors.newName}
                    className={movementErrors.newName ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                    id={`name-${movement.id}`}
                    placeholder="Ej. Juan Pérez López"
                    value={nameValue}
                    onChange={(event) => handleAltaNameChange(event.target.value)}
                  />
                  <FieldDescription>Si el nombre tiene al menos tres partes, se sugerirá correo y username.</FieldDescription>
                  <FieldError>{movementErrors.newName}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`dpi-${movement.id}`}>DPI *</FieldLabel>
                <FieldContent>
                  <Input
                    aria-invalid={!!dpiError}
                    className={dpiError ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                    id={`dpi-${movement.id}`}
                    inputMode="numeric"
                    maxLength={13}
                    placeholder="Ingresa 13 dígitos"
                    value={dpiValue}
                    onChange={(event) => update({ newDpi: sanitizeDigits(event.target.value, 13) })}
                  />
                  <FieldError>{dpiError}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`empid-${movement.id}`}>ID de empleado *</FieldLabel>
                <FieldContent>
                  <Input
                    aria-invalid={!!movementErrors.newId}
                    className={movementErrors.newId ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                    id={`empid-${movement.id}`}
                    inputMode="numeric"
                    placeholder="Ej. 12345"
                    value={employeeIdValue}
                    onChange={(event) => update({ newId: sanitizeDigits(event.target.value) })}
                  />
                  <FieldError>{movementErrors.newId}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`username-${movement.id}`}>Username *</FieldLabel>
                <FieldContent>
                  <Input
                    aria-invalid={!!movementErrors.newUsername}
                    className={movementErrors.newUsername ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                    id={`username-${movement.id}`}
                    placeholder="Ej. mcjperez"
                    value={usernameValue}
                    onChange={(event) => update({ newUsername: event.target.value.trim() })}
                    disabled={!allowCredentialEdit}
                  />
                  <FieldDescription>
                    {allowCredentialEdit
                      ? "Puedes ajustar el username si el sistema detectó un conflicto."
                      : "Se genera automáticamente a partir del nombre."}
                  </FieldDescription>
                  <FieldError>{movementErrors.newUsername}</FieldError>
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-4">
              <Field>
                <FieldLabel htmlFor={`email-${movement.id}`}>Correo electrónico *</FieldLabel>
                <FieldContent>
                  <Input
                    aria-invalid={!!movementErrors.newEmail || hasCredentialConflict}
                    className={
                      movementErrors.newEmail || hasCredentialConflict
                        ? "border-destructive focus-visible:ring-destructive/40"
                        : undefined
                    }
                    id={`email-${movement.id}`}
                    inputMode="email"
                    placeholder="usuario@acredicom.com.gt"
                    type="email"
                    value={emailValue}
                    onChange={(event) => update({ newEmail: event.target.value.trim() })}
                    disabled={!allowCredentialEdit}
                  />
                  <FieldDescription>
                    {allowCredentialEdit
                      ? "Puedes ajustar el correo si el sistema detectó un conflicto."
                      : "Se genera automáticamente a partir del nombre."}
                  </FieldDescription>
                  <FieldError>{movementErrors.newEmail}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`password-${movement.id}`}>Contraseña *</FieldLabel>
                <FieldContent>
                  <Input
                    aria-invalid={!!movementErrors.newPassword}
                    className={movementErrors.newPassword ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                    id={`password-${movement.id}`}
                    placeholder="Contraseña generada automáticamente"
                    type="text"
                    value={passwordValue}
                    disabled
                  />
                  <FieldDescription>Se genera automáticamente con el mes y año actuales.</FieldDescription>
                  <FieldError>{movementErrors.newPassword || movementErrors.newConfirmPassword}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`agency-${movement.id}`}>Agencia *</FieldLabel>
                <FieldContent>
                  <SearchableSelect
                    id={`agency-${movement.id}`}
                    value={movement.newAgency ?? ""}
                    onChange={(value) => update({ newAgency: value })}
                    options={agenciesOptions}
                    placeholder={canListAgencies ? "Selecciona una agencia" : "Sin permiso para listar agencias"}
                    searchPlaceholder="Buscar agencia..."
                    className={movementErrors.newAgency ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                    emptyMessage={agenciesEmptyMessage}
                    disabled={!canListAgencies}
                  />
                  <FieldError>{movementErrors.newAgency}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor={`position-${movement.id}`}>Puesto *</FieldLabel>
                <FieldContent>
                  <SearchableSelect
                    id={`position-${movement.id}`}
                    value={movement.newPosition ?? ""}
                    onChange={(value) => update({ newPosition: value })}
                    options={positionsOptions}
                    placeholder={canListPositions ? "Selecciona un puesto" : "Sin permiso para listar puestos"}
                    searchPlaceholder="Buscar puesto..."
                    className={movementErrors.newPosition ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                    emptyMessage={positionsEmptyMessage}
                    disabled={!canListPositions}
                  />
                  <FieldError>{movementErrors.newPosition}</FieldError>
                </FieldContent>
              </Field>
            </div>

            <div className="lg:col-span-2">
              {movementErrors.submit ? (
                <div className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {movementErrors.submit}
                </div>
              ) : null}
            </div>

            <Field className="lg:col-span-2">
              <FieldLabel htmlFor={`obs-${movement.id}`}>Observaciones</FieldLabel>
              <FieldContent>
                <Textarea
                  id={`obs-${movement.id}`}
                  rows={3}
                  maxLength={300}
                  placeholder="Agrega contexto sobre este movimiento..."
                  value={movement.observations}
                  onChange={(event) => update({ observations: event.target.value })}
                />
                <FieldDescription className="text-right">{movement.observations.length}/300</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        ) : isMovimiento ? (
          <FieldGroup className="grid gap-6 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor={`date-${movement.id}`}>Fecha efectiva *</FieldLabel>
              <FieldContent>
                <MovementDatePicker
                  id={`date-${movement.id}`}
                  value={movement.effectiveDate}
                  onChange={(value) => update({ effectiveDate: value })}
                />
                <FieldDescription>Fecha en la que tomará efecto el cambio.</FieldDescription>
                <FieldError>{movementErrors.effectiveDate}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor={`agency-${movement.id}`}>Asignar agencia *</FieldLabel>
              <FieldContent>
                <SearchableSelect
                  id={`agency-${movement.id}`}
                  value={movement.newAgency ?? ""}
                  onChange={(value) => update({ newAgency: value })}
                  options={agenciesOptions}
                  placeholder={canListAgencies ? "Selecciona una agencia" : "Sin permiso para listar agencias"}
                  searchPlaceholder="Buscar agencia..."
                  className={movementErrors.newAgency ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                  emptyMessage={agenciesEmptyMessage}
                  disabled={!canListAgencies}
                />
                <FieldError>{movementErrors.newAgency}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor={`position-${movement.id}`}>Puesto *</FieldLabel>
              <FieldContent>
                <SearchableSelect
                  id={`position-${movement.id}`}
                  value={movement.newPosition ?? ""}
                  onChange={(value) => update({ newPosition: value })}
                  options={positionsOptions}
                  placeholder={canListPositions ? "Selecciona un puesto" : "Sin permiso para listar puestos"}
                  searchPlaceholder="Buscar puesto..."
                  className={movementErrors.newPosition ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                  emptyMessage={positionsEmptyMessage}
                  disabled={!canListPositions}
                />
                <FieldError>{movementErrors.newPosition}</FieldError>
              </FieldContent>
            </Field>

            <Field className="md:col-span-3">
              <FieldLabel htmlFor={`obs-${movement.id}`}>Observaciones</FieldLabel>
              <FieldContent>
                <Textarea
                  id={`obs-${movement.id}`}
                  rows={3}
                  maxLength={300}
                  placeholder="Agrega contexto sobre este movimiento..."
                  value={movement.observations}
                  onChange={(event) => update({ observations: event.target.value })}
                />
                <FieldDescription className="text-right">{movement.observations.length}/300</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        ) : isBaja ? (
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`date-${movement.id}`}>Fecha efectiva *</FieldLabel>
              <FieldContent>
                <MovementDatePicker
                  id={`date-${movement.id}`}
                  value={movement.effectiveDate}
                  onChange={(value) => update({ effectiveDate: value })}
                />
                <FieldDescription>Fecha en la que tomará efecto el cambio.</FieldDescription>
                <FieldError>{movementErrors.effectiveDate}</FieldError>
              </FieldContent>
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel htmlFor={`obs-${movement.id}`}>Observaciones</FieldLabel>
              <FieldContent>
                <Textarea
                  id={`obs-${movement.id}`}
                  rows={3}
                  maxLength={300}
                  placeholder="Agrega contexto sobre este movimiento..."
                  value={movement.observations}
                  onChange={(event) => update({ observations: event.target.value })}
                />
                <FieldDescription className="text-right">{movement.observations.length}/300</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        ) : (
          <FieldGroup className="grid gap-6 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`date-${movement.id}`}>Fecha efectiva *</FieldLabel>
              <FieldContent>
                <MovementDatePicker
                  id={`date-${movement.id}`}
                  value={movement.effectiveDate}
                  onChange={(value) => update({ effectiveDate: value })}
                />
                <FieldDescription>Fecha en la que tomará efecto el cambio.</FieldDescription>
                <FieldError>{movementErrors.effectiveDate}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor={`agency-${movement.id}`}>Asignar agencia *</FieldLabel>
              <FieldContent>
                <SearchableSelect
                  id={`agency-${movement.id}`}
                  value={movement.newAgency ?? ""}
                  onChange={(value) => update({ newAgency: value })}
                  options={agenciesOptions}
                  placeholder={canListAgencies ? "Selecciona una agencia" : "Sin permiso para listar agencias"}
                  searchPlaceholder="Buscar agencia..."
                  className={movementErrors.newAgency ? "border-destructive focus-visible:ring-destructive/40" : undefined}
                  emptyMessage={agenciesEmptyMessage}
                  disabled={!canListAgencies}
                />
                <FieldError>{movementErrors.newAgency}</FieldError>
              </FieldContent>
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel htmlFor={`obs-${movement.id}`}>Observaciones</FieldLabel>
              <FieldContent>
                <Textarea
                  id={`obs-${movement.id}`}
                  rows={3}
                  maxLength={300}
                  placeholder="Agrega contexto sobre este movimiento..."
                  value={movement.observations}
                  onChange={(event) => update({ observations: event.target.value })}
                />
                <FieldDescription className="text-right">{movement.observations.length}/300</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        )}
      </CardContent>
    </Card>
  );
}
