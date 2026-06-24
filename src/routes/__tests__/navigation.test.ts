import { isValidElement, type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { adminRoutes } from "../admin.routes";
import { dataRoutes } from "../data-routes";
import { PermissionRoute } from "@/components/protected-route/PermissionRoute";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

function expectPermissionRoute(element: unknown, permission: string) {
  expect(isValidElement(element)).toBe(true);
  const routeElement = element as ReactElement<{ requiredPermission: string }>;
  expect(routeElement.type).toBe(PermissionRoute);
  expect(routeElement.props.requiredPermission).toBe(permission);
}

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
          requiredPermission: OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS,
        },
        {
          title: "Administracion solicitudes",
          url: "/mi-acceso/administracion-solicitudes",
          requiredPermission: OAUTH_PERMISSIONS.MANAGE_ACCESS_REQUESTS,
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
    expect(miAccesoRoute?.children).toHaveLength(6);
    expect(miAccesoRoute?.children?.[0]?.index).toBe(true);
    expect(miAccesoRoute?.children?.[1]?.path).toBe("nueva");
    expect(miAccesoRoute?.children?.[2]?.path).toBe("requerimiento-accesos");
    expect(miAccesoRoute?.children?.[3]?.path).toBe("detalle/:id");
    expect(miAccesoRoute?.children?.[4]?.path).toBe("administracion-solicitudes");
    expect(miAccesoRoute?.children?.[5]?.path).toBe("administracion-solicitudes/detalle/:id");
    expectPermissionRoute(miAccesoRoute?.children?.[0]?.element, OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS);
    expectPermissionRoute(miAccesoRoute?.children?.[1]?.element, OAUTH_PERMISSIONS.CREATE_ACCESS_REQUEST);
    expectPermissionRoute(miAccesoRoute?.children?.[2]?.element, OAUTH_PERMISSIONS.CREATE_ACCESS_REQUEST);
    expectPermissionRoute(miAccesoRoute?.children?.[3]?.element, OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS);
    expectPermissionRoute(miAccesoRoute?.children?.[4]?.element, OAUTH_PERMISSIONS.MANAGE_ACCESS_REQUESTS);
    expectPermissionRoute(miAccesoRoute?.children?.[5]?.element, OAUTH_PERMISSIONS.MANAGE_ACCESS_REQUESTS);
  });

  it("expone Auditoria como módulo principal y mantiene su ruta admin", () => {
    const auditoria = dataRoutes.navMain.find((item) => item.title === "Auditoria");
    const auditoriaRoute = adminRoutes.find((route) => route.path === "auditoria");

    expect(auditoria).toMatchObject({
      title: "Auditoria",
      url: "/auditoria",
      requiredPermission: OAUTH_PERMISSIONS.AUDIT_LOG_ACCESS,
    });

    expect(auditoriaRoute).toBeDefined();
    expect(auditoriaRoute?.children).toHaveLength(1);
    expect(auditoriaRoute?.children?.[0]?.index).toBe(true);
  });

  it("ubica Puestos como subitem de Unidades de trabajo y mantiene su ruta admin", () => {
    const unidadesTrabajo = dataRoutes.navMain.find((item) => item.title === "Unidades de trabajo");
    const puestosRoute = adminRoutes.find((route) => route.path === "puestos");

    expect(unidadesTrabajo?.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Puestos",
          url: "/puestos",
          requiredPermission: OAUTH_PERMISSIONS.VIEW_POSITION,
        }),
      ]),
    );

    expect(puestosRoute).toBeDefined();
    expect(puestosRoute?.children).toHaveLength(1);
    expect(puestosRoute?.children?.[0]?.index).toBe(true);
    expectPermissionRoute(puestosRoute?.element, OAUTH_PERMISSIONS.VIEW_POSITION);
  });
});
