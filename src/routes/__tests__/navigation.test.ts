import { describe, expect, it } from "vitest";

import { adminRoutes } from "../admin.routes";
import { dataRoutes } from "../data-routes";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

describe("talento humano navigation", () => {
  it("agrupa Movimientos y Reporteria bajo Talento Humano en el sidebar", () => {
    const talentoHumano = dataRoutes.navMain.find((item) => item.title === "Talento Humano");

    expect(talentoHumano).toBeDefined();
    expect(talentoHumano?.items).toEqual([
      {
        title: "Movimientos",
        url: "/movimientos",
        requiredPermission: OAUTH_PERMISSIONS.MOVEMENTS_ACCESS,
      },
      {
        title: "Reporteria",
        url: "/reporteria",
        requiredPermission: OAUTH_PERMISSIONS.MOVEMENTS_REPORT_ACCESS,
      },
    ]);
  });

  it("expone la ruta de movimientos en adminRoutes", () => {
    const movimientosRoute = adminRoutes.find((route) => route.path === "movimientos");

    expect(movimientosRoute).toBeDefined();
    expect(movimientosRoute?.children).toHaveLength(1);
    expect(movimientosRoute?.children?.[0]?.index).toBe(true);
  });
});
