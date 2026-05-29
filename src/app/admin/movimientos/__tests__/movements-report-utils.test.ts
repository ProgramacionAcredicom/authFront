import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";
import type { MovementLogApi } from "@/interfaces/movements.interfaces";

import { buildMovementReportPayload, getRecentMovementsRange, mapMovementLogs } from "../movements-report-utils";

describe("movements-report-utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-27T12:00:00Z"));
  });

  it("calcula el rango reciente por default de los últimos 7 días", () => {
    expect(getRecentMovementsRange()).toEqual({
      fechaInicio: "2026-05-21",
      fechaFin: "2026-05-27",
    });
  });

  it("mapea correctamente los movimientos del backend a filas de tabla", () => {
    const apiMovements: MovementLogApi[] = [
      {
        id: 10,
        tipo_accion: "MOVIMIENTO",
        fecha_accion: "2026-05-27",
        current_value: "Agencia Central / Analista",
        new_value: {
          role: "Supervisor",
          agency: "Agencia Norte",
        },
        affected_user: {
          id: 5,
          name: "Ana Pérez",
          username: "aperez",
        },
        created_by: {
          id: 1,
          name: "Carlos Admin",
          username: "cadmin",
        },
        comment: "Ascenso aprobado",
        is_apply: true,
      },
    ];

    expect(mapMovementLogs(apiMovements)).toEqual([
      {
        id: 10,
        tipoAccion: "MOVIMIENTO",
        fechaAccion: "2026-05-27",
        currentAssignment: {
          agency: "Central",
          role: "Analista",
        },
        newAssignment: {
          agency: "Norte",
          role: "Supervisor",
        },
        currentValue: "Agencia: Central • Puesto: Analista",
        newValue: "Agencia: Norte • Puesto: Supervisor",
        affectedUserName: "Ana Pérez",
        affectedUsername: "aperez",
        createdByName: "Carlos Admin",
        createdByUsername: "cadmin",
        comment: "Ascenso aprobado",
        isApply: true,
      },
    ]);
  });

  it("soporta strings legacy con claves agency/role y ausencia parcial de datos", () => {
    const apiMovements: MovementLogApi[] = [
      {
        id: 11,
        tipo_accion: "ROTACION",
        fecha_accion: "2026-05-27",
        current_value: "role: Asesor de Créditos • agency: Comitancillo",
        new_value: "agency: San Lorenzo",
        affected_user: null,
        created_by: null,
        comment: null,
        is_apply: false,
      },
      {
        id: 12,
        tipo_accion: "BAJA",
        fecha_accion: "2026-05-27",
        current_value: "Sin valor actual",
        new_value: null,
        affected_user: null,
        created_by: null,
        comment: null,
        is_apply: false,
      },
    ];

    expect(mapMovementLogs(apiMovements)).toEqual([
      expect.objectContaining({
        currentAssignment: {
          agency: "Comitancillo",
          role: "Asesor de Créditos",
        },
        newAssignment: {
          agency: "San Lorenzo",
        },
        currentValue: "Agencia: Comitancillo • Puesto: Asesor de Créditos",
        newValue: "Agencia: San Lorenzo",
      }),
      expect.objectContaining({
        currentAssignment: {
          fallbackText: "Sin asignación actual",
        },
        newAssignment: {
          fallbackText: "Sin nueva asignación",
        },
        currentValue: "Sin asignación actual",
        newValue: "Sin nueva asignación",
      }),
    ]);
  });

  it("arma el payload de email-report omitiendo el tipo cuando no hay tipos seleccionados", () => {
    const collaborators = [
      { id: 3, name: "Ana Pérez" },
      { id: 4, name: "Mario Soto" },
    ] as CollaboratorResult[];

    expect(
      buildMovementReportPayload(
        {
          fechaInicio: "2026-05-21",
          fechaFin: "2026-05-27",
        },
        collaborators,
        [],
      ),
    ).toEqual({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
      colaborador_ids: [3, 4],
    });
  });

  it("arma el payload de email-report enviando arreglo de tipos cuando hay selección", () => {
    const collaborators = [{ id: 3, name: "Ana Pérez" }] as CollaboratorResult[];

    expect(
      buildMovementReportPayload(
        {
          fechaInicio: "2026-05-21",
          fechaFin: "2026-05-27",
        },
        collaborators,
        ["ALTA", "BAJA"],
      ),
    ).toEqual({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
      colaborador_ids: [3],
      tipo: ["ALTA", "BAJA"],
    });
  });
});
