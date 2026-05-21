"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ClipboardList, Plus } from "lucide-react";
import { toast } from "sonner";

import { useQueryAgencias } from "@/hooks/agencias/useQueryAgencias";
import { useQueryRoles } from "@/hooks/roles/useQueryRoles";
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

import {
  ACTION_LABELS,
  getTodayEffectiveDate,
  type ActionType,
  type Movement,
  type MovementValidationErrors,
} from "./movements-data";
import { MovementCard } from "./movement-card";

function buildMovementSummary(movements: Movement[]) {
  const totals = movements.reduce<Record<ActionType, number>>(
    (accumulator, movement) => {
      accumulator[movement.actionType] += 1;
      return accumulator;
    },
    {
      alta: 0,
      baja: 0,
      movimiento: 0,
      rotacion: 0,
    },
  );

  return (Object.keys(totals) as ActionType[])
    .filter((key) => totals[key] > 0)
    .map((key) => `${ACTION_LABELS[key]}: ${totals[key]}`)
    .join(" · ");
}

function validateMovement(movement: Movement): MovementValidationErrors {
  const errors: MovementValidationErrors = {};

  if (!movement.effectiveDate) {
    errors.effectiveDate = "La fecha efectiva es requerida.";
  }

  if (movement.actionType === "alta") {
    if (!movement.newName?.trim()) {
      errors.newName = "El nombre completo es requerido.";
    }

    if (!movement.newDpi?.trim()) {
      errors.newDpi = "El DPI es requerido.";
    } else if (movement.newDpi.length !== 13) {
      errors.newDpi = "El DPI debe contener exactamente 13 dígitos numéricos.";
    }

    if (!movement.newAgency?.trim()) {
      errors.newAgency = "La agencia es requerida.";
    }

    if (!movement.newPosition?.trim()) {
      errors.newPosition = "El puesto es requerido.";
    }
  }

  if (movement.actionType === "baja") {
    if (!movement.collaborator) {
      errors.collaborator = "Selecciona un colaborador.";
    }
  }

  if (movement.actionType === "movimiento") {
    if (!movement.collaborator) {
      errors.collaborator = "Selecciona un colaborador.";
    }

    if (!movement.newAgency?.trim()) {
      errors.newAgency = "La agencia es requerida.";
    }

    if (!movement.newPosition?.trim()) {
      errors.newPosition = "El puesto es requerido.";
    }
  }

  if (movement.actionType === "rotacion") {
    if (!movement.collaborator) {
      errors.collaborator = "Selecciona un colaborador.";
    }

    if (!movement.newAgency?.trim()) {
      errors.newAgency = "La agencia es requerida.";
    }
  }

  return errors;
}

function buildValidationMap(movements: Movement[]) {
  return movements.reduce<Record<string, MovementValidationErrors>>((accumulator, movement) => {
    const errors = validateMovement(movement);

    if (Object.keys(errors).length > 0) {
      accumulator[movement.id] = errors;
    }

    return accumulator;
  }, {});
}

export default function MiAccesoPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, MovementValidationErrors>>({});
  const { queryAgencias } = useQueryAgencias();
  const { queryRoles } = useQueryRoles();

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

  const agenciesEmptyMessage = queryAgencias.isLoading
    ? "Cargando agencias..."
    : queryAgencias.isError
      ? "No se pudieron cargar las agencias."
      : "Sin agencias.";

  const positionsEmptyMessage = queryRoles.isLoading
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

  const handleConfirm = () => {
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

    setValidationErrors({});

    toast.success("Movimientos listos para revisión", {
      description: buildMovementSummary(movements),
    });
  };

  return (
    <PageShell contentClassName="max-w-6xl gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <Title text="Mi Acceso" />
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
              key={movement.id}
              index={index}
              movement={movement}
              movementErrors={validationErrors[movement.id]}
              onChange={(nextMovement) => handleChange(index, nextMovement)}
              onRemove={() => handleRemove(index)}
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
                  <Button type="button" variant="outline">
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

              <Button type="button" variant="custom2" onClick={handleConfirm}>
                <CheckCircle2 data-icon="inline-start" aria-hidden="true" />
                Confirmar {movements.length} movimiento{movements.length === 1 ? "" : "s"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
