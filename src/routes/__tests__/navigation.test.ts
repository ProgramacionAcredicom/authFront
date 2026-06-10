import { describe, expect, it } from "vitest";

import { adminRoutes } from "../admin.routes";
import { dataRoutes } from "../data-routes";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

describe("talento humano navigation", () => {
  it("agrupa Mis solicitudes y Administracion solicitudes bajo Mi acceso en el sidebar", () => {
    const miAcceso = dataRoutes.navMain.find((item) => item.title === "Mi acceso");

    expect(miAcceso).toBeDefined();
    expect(miAcceso).toMatchObject({
      title: "Mi acceso",
      url: "/mi-acceso",
      items: [
        {
          title: "Mis solicitudes",
          url: "/mi-acceso",
        },
        {
          title: "Administracion solicitudes",
          url: "/mi-acceso/administracion-solicitudes",
        },
      ],
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
    expect(miAccesoRoute?.children).toHaveLength(4);
    expect(miAccesoRoute?.children?.[0]?.index).toBe(true);
    expect(miAccesoRoute?.children?.[1]?.path).toBe("nueva");
    expect(miAccesoRoute?.children?.[2]?.path).toBe("requerimiento-accesos");
    expect(miAccesoRoute?.children?.[3]?.path).toBe("administracion-solicitudes");
  });

  it("ubica Puestos como subitem de Unidades de trabajo y mantiene su ruta admin", () => {
    const unidadesTrabajo = dataRoutes.navMain.find((item) => item.title === "Unidades de trabajo");
    const puestosRoute = adminRoutes.find((route) => route.path === "puestos");

    expect(unidadesTrabajo?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Puestos",
          url: "/puestos",
          requiresStaff: true,
        }),
      ]),
    );

    expect(puestosRoute).toBeDefined();
    expect(puestosRoute?.children).toHaveLength(1);
    expect(puestosRoute?.children?.[0]?.index).toBe(true);
  });
});
