"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";
import type { GetMovementsParams, MovementLogType } from "@/interfaces/movements.interfaces";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/page-shell";
import { Title } from "@/components/title/Title";
import MovimientosTablePage from "@/components/tables/movimientos/page";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useMutationMovementReport } from "@/hooks/movements/useMutationMovementReport";
import { useQueryMovements } from "@/hooks/movements/useQueryMovements";
import { RecipientMultiSelect } from "./recipient-multi-select";
import { buildMovementReportPayload, getRecentMovementsRange, mapMovementLogs } from "./movements-report-utils";

const MOVEMENT_TYPE_OPTIONS: { label: string; value: MovementLogType }[] = [
  { label: "Altas", value: "ALTA" },
  { label: "Bajas", value: "BAJA" },
  { label: "Movimientos", value: "MOVIMIENTO" },
  { label: "Rotaciones", value: "ROTACION" },
];
const FILTERS_DEBOUNCE_MS = 500;

export default function MovimientosPage() {
  const defaultRange = useMemo(() => getRecentMovementsRange(), []);
  const [draftFilters, setDraftFilters] = useState<{ fechaInicio: string; fechaFin: string; tipos: MovementLogType[] }>({
    fechaInicio: defaultRange.fechaInicio,
    fechaFin: defaultRange.fechaFin,
    tipos: [],
  });
  const [appliedFilters, setAppliedFilters] = useState<{ fechaInicio: string; fechaFin: string; tipos: MovementLogType[] }>({
    fechaInicio: defaultRange.fechaInicio,
    fechaFin: defaultRange.fechaFin,
    tipos: [],
  });
  const [selectedRecipients, setSelectedRecipients] = useState<CollaboratorResult[]>([]);
  const syncAppliedFilters = useDebouncedCallback((nextFilters: typeof draftFilters) => {
    setAppliedFilters(nextFilters);
  }, FILTERS_DEBOUNCE_MS);

  const queryParams = useMemo<GetMovementsParams>(
    () => ({
      fecha_inicio: appliedFilters.fechaInicio,
      fecha_fin: appliedFilters.fechaFin,
      ...(appliedFilters.tipos.length > 0 ? { tipo: appliedFilters.tipos } : {}),
    }),
    [appliedFilters],
  );

  const movementsQuery = useQueryMovements(queryParams);
  const { mutation: movementReportMutation } = useMutationMovementReport();

  const rows = useMemo(() => {
    return mapMovementLogs(movementsQuery.data ?? []);
  }, [movementsQuery.data]);

  useEffect(() => {
    if (!draftFilters.fechaInicio || !draftFilters.fechaFin) return;

    if (
      draftFilters.fechaInicio === appliedFilters.fechaInicio &&
      draftFilters.fechaFin === appliedFilters.fechaFin &&
      draftFilters.tipos.length === appliedFilters.tipos.length &&
      draftFilters.tipos.every((tipo, index) => tipo === appliedFilters.tipos[index])
    ) {
      return;
    }

    syncAppliedFilters(draftFilters);
  }, [appliedFilters, draftFilters, syncAppliedFilters]);

  const handleSendReport = async () => {
    if (selectedRecipients.length === 0) {
      toast.error("Selecciona al menos un colaborador para enviar el reporte.");
      return;
    }

    const payload = buildMovementReportPayload(
      {
        fechaInicio: appliedFilters.fechaInicio,
        fechaFin: appliedFilters.fechaFin,
      },
      selectedRecipients,
      appliedFilters.tipos,
    );

    try {
      await movementReportMutation.mutateAsync(payload);
      toast.success("Reporte enviado correctamente", {
        description: `${selectedRecipients.length} colaborador${selectedRecipients.length === 1 ? "" : "es"} destinatario${selectedRecipients.length === 1 ? "" : "s"}.`,
      });
    } catch {
      // El hook ya maneja el toast de error.
    }
  };

  return (
    <PageShell contentClassName="max-w-full gap-4 overflow-x-hidden sm:gap-6">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <Title text="Movimientos" />
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Consulta la reportería reciente de movimientos, refina el rango cuando lo necesités y enviá el informe a los colaboradores seleccionados.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Enviar reportería</CardTitle>
            <CardDescription>
              Selecciona los colaboradores destinatarios del reporte. El envío usará el mismo rango y tipo que ves actualmente en la tabla.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-full flex-col gap-4">
            <RecipientMultiSelect selectedRecipients={selectedRecipients} onChange={setSelectedRecipients} />

            <div className="mt-auto flex justify-end">
              <Button
                type="button"
                variant="custom2"
                onClick={() => void handleSendReport()}
                disabled={selectedRecipients.length === 0 || movementReportMutation.isPending}
              >
                {movementReportMutation.isPending ? (
                  <>
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                    Enviando reporte...
                  </>
                ) : (
                  <>
                    <Mail data-icon="inline-start" />
                    Enviar reporte
                  </>
                )}
              </Button>
            </div>
          </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden px-4 sm:px-6">
          {movementsQuery.isError ? (
            <Alert variant="destructive">
              <AlertTitle>Error al cargar movimientos</AlertTitle>
              <AlertDescription>
                {movementsQuery.error instanceof Error
                  ? movementsQuery.error.message
                  : "No se pudieron cargar los movimientos del rango seleccionado."}
              </AlertDescription>
            </Alert>
          ) : (
            <MovimientosTablePage
              data={rows}
              isLoading={movementsQuery.isLoading || movementsQuery.isFetching}
              filters={draftFilters}
              movementTypeOptions={MOVEMENT_TYPE_OPTIONS}
              onFromDateChange={(value) => setDraftFilters((previous) => ({ ...previous, fechaInicio: value }))}
              onToDateChange={(value) => setDraftFilters((previous) => ({ ...previous, fechaFin: value }))}
              onTypeChange={(value) => setDraftFilters((previous) => ({ ...previous, tipos: value }))}
            />
          )}
        </CardContent>
      </Card>

    </PageShell>
  );
}
