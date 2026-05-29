"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ClipboardList, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { useQueryAgencias } from "@/hooks/agencias/useQueryAgencias";
import { useInfoUserQuery } from "@/hooks/auth/usePermissionAccess";
import { useMutationCreateMovements } from "@/hooks/movements/useMutationMovements";
import { useQueryRoles } from "@/hooks/roles/useQueryRoles";
import { OAUTH_PERMISSIONS, hasAccess } from "@/lib/permissions";
import { PageShell } from "@/components/layout/page-shell";
import { Title } from "@/components/title/Title";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ACTION_LABELS, getTodayEffectiveDate, type ActionType, type Movement, type MovementValidationErrors } from "./movements-data";
import { MovementCard } from "./movement-card";
import { buildMovementSummary, buildValidationMap, serializeMovementsPayload } from "./movements-utils";

export default function MiAccesoPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, MovementValidationErrors>>({});
  const { data: user } = useInfoUserQuery();
  const canListAgencies = hasAccess(user, OAUTH_PERMISSIONS.LIST_AGENCIES);
  const canListRoles = hasAccess(user, OAUTH_PERMISSIONS.LIST_ROLES);
  const { queryAgencias } = useQueryAgencias({ enabled: canListAgencies });
  const { queryRoles } = useQueryRoles({ enabled: canListRoles });
  const { mutation: createMovementsMutation } = useMutationCreateMovements();

  const agencyOptions = useMemo(
    () =>
      (queryAgencias.data ?? []).map((agency) => ({
        label: agency.name,
        value: agency.name,
        keywords: [agency.code],
      })),
    [queryAgencias.data],
  );

  const positionOptions = useMemo(
    () =>
      (queryRoles.data ?? []).map((role) => ({
        label: role.role,
        value: role.role,
      })),
    [queryRoles.data],
  );

  const agenciesEmptyMessage = !canListAgencies
    ? "No tienes permisos para consultar agencias."
    : queryAgencias.isLoading
    ? "Cargando agencias..."
    : queryAgencias.isError
      ? "No se pudieron cargar las agencias."
      : "Sin agencias.";

  const positionsEmptyMessage = !canListRoles
    ? "No tienes permisos para consultar puestos."
    : queryRoles.isLoading
    ? "Cargando puestos..."
    : queryRoles.isError
      ? "No se pudieron cargar los puestos."
      : "Sin puestos.";

  const handleChange = (index: number, movement: Movement) => {
    const shouldRevalidate = Object.keys(validationErrors).length > 0;

    setMovements((previous) => {
      const nextMovements = previous.map((item, itemIndex) => itemIndex === index ? movement : item);

      if (shouldRevalidate) {
        setValidationErrors(buildValidationMap(nextMovements));
      }

      return nextMovements;
    });
  };

  const handleRemove = (index: number) => {
    const shouldRevalidate = Object.keys(validationErrors).length > 0;

    setMovements((previous) => {
      const nextMovements = previous.filter((_, itemIndex) => itemIndex !== index);

      if (shouldRevalidate) {
        setValidationErrors(buildValidationMap(nextMovements));
      }

      return nextMovements;
    });
  };

  const handleAddWithType = (actionType: ActionType) => {
    setMovements((previous) => [
      ...previous,
      {
        id: `m-${Date.now()}-${previous.length}`,
        actionType,
        effectiveDate: getTodayEffectiveDate(),
        collaborator: null,
        observations: "",
      },
    ]);
  };

  const handleConfirm = async () => {
    if (movements.length === 0) {
      toast.info("No hay movimientos para confirmar.");
      return;
    }

    const nextValidationErrors = buildValidationMap(movements);

    if (Object.keys(nextValidationErrors).length > 0) {
      setValidationErrors(nextValidationErrors);
      toast.error("Completa los campos requeridos antes de confirmar.");
      return;
    }

    let payload;

    try {
      payload = serializeMovementsPayload(movements, {
        agencies: queryAgencias.data ?? [],
        roles: queryRoles.data ?? [],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo preparar el lote de movimientos.";
      toast.error(message);
      return;
    }

    try {
      await createMovementsMutation.mutateAsync(payload);
      setValidationErrors({});
      setMovements([]);
      toast.success("Movimientos registrados correctamente", {
        description: buildMovementSummary(movements),
      });
    } catch {
      // El hook de mutation ya muestra el mensaje de error.
    }
  };

  return (
    <PageShell contentClassName="max-w-6xl gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <Title text="Movimientos" />
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Registra altas, bajas, movimientos y rotaciones. Todos los cambios se aplicarán en la fecha efectiva indicada.
            </p>
          </div>

          <div className="rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
            <span className="text-muted-foreground">Movimientos pendientes</span>
            <p className="mt-1 text-right text-2xl font-semibold text-foreground">{movements.length}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {movements.length > 0 ? (
          movements.map((movement, index) => (
            <MovementCard
              agenciesEmptyMessage={agenciesEmptyMessage}
              agenciesOptions={agencyOptions}
              canListAgencies={canListAgencies}
              key={movement.id}
              index={index}
              movement={movement}
              movementErrors={validationErrors[movement.id]}
              onChange={(nextMovement) => handleChange(index, nextMovement)}
              onRemove={() => handleRemove(index)}
              canListPositions={canListRoles}
              positionsEmptyMessage={positionsEmptyMessage}
              positionsOptions={positionOptions}
            />
          ))
        ) : (
          <Empty className="border border-dashed bg-card py-14">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardList aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No hay movimientos registrados</EmptyTitle>
              <EmptyDescription>
                Agrega un movimiento desde la barra inferior para iniciar la captura del lote actual.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>

      <div className="sticky bottom-4 z-10">
        <div className="rounded-2xl border bg-card/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Revisa los movimientos antes de confirmar. Esta acción notificará a las áreas correspondientes.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" disabled={createMovementsMutation.isPending}>
                    <Plus data-icon="inline-start" aria-hidden="true" />
                    Añadir movimiento
                    <ChevronDown data-icon="inline-end" aria-hidden="true" className="opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    {(Object.keys(ACTION_LABELS) as ActionType[]).map((actionType) => (
                      <DropdownMenuItem key={actionType} onClick={() => handleAddWithType(actionType)}>
                        {ACTION_LABELS[actionType]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                variant="custom2"
                onClick={handleConfirm}
                disabled={createMovementsMutation.isPending}
              >
                {createMovementsMutation.isPending ? (
                  <>
                    <Loader2 data-icon="inline-start" aria-hidden="true" className="animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 data-icon="inline-start" aria-hidden="true" />
                    Confirmar {movements.length} movimiento{movements.length === 1 ? "" : "s"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
