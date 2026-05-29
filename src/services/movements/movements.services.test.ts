import { describe, expect, it, vi } from "vitest";

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}));

vi.mock("../configAxios", () => ({
  default: {
    get: getMock,
    post: vi.fn(),
  },
}));

import { getMovements } from "./movements.services";

describe("movements.services", () => {
  it("serializa múltiples tipos para el listado como lista separada por comas", async () => {
    getMock.mockResolvedValueOnce({ data: [] });

    await getMovements({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
      tipo: ["ALTA", "BAJA"],
    });

    expect(getMock).toHaveBeenCalledWith("/users/movements/", {
      params: {
        fecha_inicio: "2026-05-21",
        fecha_fin: "2026-05-27",
        tipo: "ALTA,BAJA",
      },
    });
  });
});
