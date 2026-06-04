import { describe, expect, it } from "vitest";

import { adminRoutes } from "../admin.routes";
import { dataRoutes } from "../data-routes";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

describe("talento humano navigation", () => {
  it("incluye el módulo MI ACCESO como entrada separada del sidebar", () => {
    const miAcceso = dataRoutes.navMain.find((item) => item.title === "MI ACCESO");

    expect(miAcceso).toBeDefined();
    expect(miAcceso).toMatchObject({
      title: "MI ACCESO",
      url: "/mi-acceso",
    });
  });

  it("agrupa Movimientos y Reporteria bajo Talento Humano en el sidebar", () => {
    const talentoHumano = dataRoutes.navMain.find((item) => item.title === "Talento Humano");

    expect(talentoHumano).toBeDefined();
    expect(talentoHumano?.url).toBe("/talento-humano");
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

  it("expone la ruta mi-acceso en adminRoutes", () => {
    const miAccesoRoute = adminRoutes.find((route) => route.path === "mi-acceso");

    expect(miAccesoRoute).toBeDefined();
    expect(miAccesoRoute?.children).toHaveLength(1);
    expect(miAccesoRoute?.children?.[0]?.index).toBe(true);
  });
});
