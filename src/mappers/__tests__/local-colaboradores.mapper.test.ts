import { describe, expect, it } from "vitest";

import { localColaboradorByIdMapper, localColaboradoresMapper } from "../local-colaboradores.mapper";

describe("local-colaboradores mapper", () => {
  it("propaga is_blocked en el listado", () => {
    const result = localColaboradoresMapper({
      total: 1,
      page: 1,
      page_size: 10,
      total_pages: 1,
      results: [
        {
          id: 1,
          dpi: "1234567890123",
          cif: "12345",
          name: "Ana Pérez",
          username: "aperez",
          user_type: "USUARIO",
          agency: { id: 1, code: "CEN", name: "Central", chif: null, state: true, no_colaboradores: 0 },
          role: { id: 2, role: "Analista", state: true },
          areas: [],
          is_active: true,
          is_blocked: true,
          is_staff: false,
          is_superuser: false,
          picture: null,
          email: "ana@example.com",
        },
      ],
    });

    expect(result.results[0].is_blocked).toBe(true);
  });

  it("propaga is_blocked en el detalle", () => {
    const result = localColaboradorByIdMapper({
      id: 2,
      dpi: "1234567890123",
      cif: "67890",
      ejecutivo_principal: null,
      name: "Luis Gómez",
      username: "lgomez",
      email: "luis@example.com",
      picture: null,
      user_type: "USUARIO",
      agency: { id: 1, name: "Central", code: "CEN", state: true },
      role: { id: 2, role: "Supervisor", state: true },
      area: { id: 3, code: "OPS", name: "Operaciones", chif: null, state: true },
      grupos: [],
      is_active: true,
      is_blocked: false,
      is_staff: false,
      is_superuser: false,
      otp_enabled: false,
      executive_number: null,
    });

    expect(result.is_blocked).toBe(false);
  });
});
