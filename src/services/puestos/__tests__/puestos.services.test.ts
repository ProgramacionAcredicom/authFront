import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createPuesto,
  deletePuesto,
  getAllPuestos,
  getPuestoById,
  updatePuesto,
} from "../puestos.services";

vi.mock("@/services/configAxios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("puestos services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mapea correctamente el listado de puestos desde /roles/", async () => {
    const apiServices = await import("@/services/configAxios");

    (apiServices.default.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        {
          id: 7,
          role: "Supervisor",
          state: true,
          grupos_count: "3",
          created_on: "2026-06-01T00:00:00Z",
        },
      ],
    });

    const result = await getAllPuestos();

    expect(apiServices.default.get).toHaveBeenCalledWith("/roles/");
    expect(result).toEqual([
      {
        id: 7,
        role: "Supervisor",
        state: true,
        gruposCount: 3,
        created_on: "2026-06-01T00:00:00Z",
        update_at: undefined,
      },
    ]);
  });

  it("obtiene el detalle del puesto desde /roles/actions/{id}/ y lo transforma a ids de grupos", async () => {
    const apiServices = await import("@/services/configAxios");

    (apiServices.default.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        id: 11,
        role: "Analista",
        state: false,
        grupos: [
          { id: 1, nombre: "Grupo A", state: true },
          { id: 2, nombre: "Grupo B", state: true },
        ],
      },
    });

    const result = await getPuestoById("11");

    expect(apiServices.default.get).toHaveBeenCalledWith("/roles/actions/11/");
    expect(result).toEqual({
      id: 11,
      role: "Analista",
      state: false,
      grupos: [1, 2],
      created_on: undefined,
      update_at: undefined,
    });
  });

  it("crea un puesto enviando grupos con ids de grupos", async () => {
    const apiServices = await import("@/services/configAxios");
    const payload = { role: "Auditor", state: true, grupos: [10, 20] };

    (apiServices.default.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        id: 5,
        role: "Auditor",
        state: true,
        grupos: [
          { id: 10, nombre: "Grupo 1", state: true },
          { id: 20, nombre: "Grupo 2", state: true },
        ],
      },
    });

    await createPuesto(payload);

    expect(apiServices.default.post).toHaveBeenCalledWith("/roles/", payload);
  });

  it("actualiza un puesto usando PUT /roles/actions/{id}/", async () => {
    const apiServices = await import("@/services/configAxios");
    const payload = { role: "Auditor Senior", state: true, grupos: [99] };

    (apiServices.default.put as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        id: 5,
        role: "Auditor Senior",
        state: true,
        grupos: [{ id: 99, nombre: "Grupo 99", state: true }],
      },
    });

    await updatePuesto("5", payload);

    expect(apiServices.default.put).toHaveBeenCalledWith("/roles/actions/5/", payload);
  });

  it("desactiva un puesto usando DELETE /roles/actions/{id}/", async () => {
    const apiServices = await import("@/services/configAxios");

    (apiServices.default.delete as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        id: 5,
        role: "Auditor",
        state: false,
        grupos: [],
      },
    });

    await deletePuesto("5");

    expect(apiServices.default.delete).toHaveBeenCalledWith("/roles/actions/5/");
  });
});
