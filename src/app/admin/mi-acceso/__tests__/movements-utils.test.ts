import { describe, expect, it } from "vitest";

import type { Movement } from "../movements-data";
import { buildValidationMap, generateCredentialsFromName, serializeMovementsPayload } from "../movements-utils";

const agencies = [
  { id: 1, name: "Central" },
  { id: 2, name: "Norte" },
];

const roles = [
  { id: 10, role: "Analista" },
  { id: 11, role: "Supervisor" },
];

describe("movements-utils", () => {
  it("genera username y correo a partir del nombre completo", () => {
    expect(generateCredentialsFromName("Juan Pablo Perez")).toEqual({
      email: "jpperez@acredicom.com.gt",
      username: "mcjpperez",
    });
  });

  it("valida los nuevos campos obligatorios para alta", () => {
    const movement: Movement = {
      id: "m-1",
      actionType: "alta",
      effectiveDate: "2026-05-26",
      collaborator: null,
      observations: "",
    };

    expect(buildValidationMap([movement])).toEqual({
      "m-1": {
        newAgency: "La agencia es requerida.",
        newConfirmPassword: "La confirmación de contraseña es requerida.",
        newDpi: "El DPI es requerido.",
        newEmail: "El correo es requerido.",
        newId: "El ID de empleado es requerido.",
        newName: "El nombre completo es requerido.",
        newPassword: "La contraseña es requerida.",
        newPosition: "El puesto es requerido.",
        newUsername: "El username es requerido.",
      },
    });
  });

  it("serializa un lote mixto al formato del backend", () => {
    const movements: Movement[] = [
      {
        id: "alta-1",
        actionType: "alta",
        effectiveDate: "2026-05-26",
        collaborator: null,
        newName: "Juan Pablo Perez",
        newDpi: "1234567890123",
        newId: "4567",
        newUsername: "mcjpperez",
        newEmail: "jpperez@acredicom.com.gt",
        newPassword: "PasswordSegura123!",
        newConfirmPassword: "PasswordSegura123!",
        newAgency: "Central",
        newPosition: "Analista",
        observations: "Alta nueva",
      },
      {
        id: "baja-1",
        actionType: "baja",
        effectiveDate: "2026-05-27",
        collaborator: {
          id: 22,
          name: "Ana Lopez",
          agency: "Central",
          agencyId: 1,
          position: "Analista",
          roleId: 10,
        },
        observations: "Baja voluntaria",
      },
      {
        id: "mov-1",
        actionType: "movimiento",
        effectiveDate: "2026-05-28",
        collaborator: {
          id: 23,
          name: "Mario Perez",
          agency: "Central",
          agencyId: 1,
          position: "Analista",
          roleId: 10,
        },
        newAgency: "Norte",
        newPosition: "Supervisor",
        observations: "Ascenso",
      },
      {
        id: "rot-1",
        actionType: "rotacion",
        effectiveDate: "2026-05-29",
        collaborator: {
          id: 24,
          name: "Luisa Díaz",
          agency: "Central",
          agencyId: 1,
          position: "Supervisor",
          roleId: 11,
        },
        newAgency: "Norte",
        observations: "Cobertura temporal",
      },
    ];

    expect(serializeMovementsPayload(movements, { agencies, roles })).toEqual([
      {
        tipo: "alta",
        fecha: "2026-05-26",
        observaciones: "Alta nueva",
        colaborador: {
          nombre: "Juan Pablo Perez",
          username: "mcjpperez",
          email: "jpperez@acredicom.com.gt",
          password: "PasswordSegura123!",
          dpi: "1234567890123",
          cif: "4567",
          agency_id: 1,
          role_id: 10,
        },
      },
      {
        tipo: "baja",
        fecha: "2026-05-27",
        observaciones: "Baja voluntaria",
        colaborador_id: 22,
        current: {
          agency_id: 1,
          role_id: 10,
        },
      },
      {
        tipo: "movimiento",
        fecha: "2026-05-28",
        observaciones: "Ascenso",
        colaborador_id: 23,
        current: {
          agency_id: 1,
          role_id: 10,
        },
        new: {
          agency_id: 2,
          role_id: 11,
        },
      },
      {
        tipo: "rotacion",
        fecha: "2026-05-29",
        observaciones: "Cobertura temporal",
        colaborador_id: 24,
        current: {
          agency_id: 1,
          role_id: 11,
        },
        new: {
          agency_id: 2,
        },
      },
    ]);
  });

  it("falla cuando no puede resolver la agencia destino", () => {
    const movement: Movement = {
      id: "mov-2",
      actionType: "movimiento",
      effectiveDate: "2026-05-28",
      collaborator: {
        id: 23,
        name: "Mario Perez",
        agency: "Central",
        agencyId: 1,
        position: "Analista",
        roleId: 10,
      },
      newAgency: "Inexistente",
      newPosition: "Supervisor",
      observations: "",
    };

    expect(() => serializeMovementsPayload([movement], { agencies, roles })).toThrow(
      'No se pudo resolver la agencia "Inexistente".',
    );
  });
});
