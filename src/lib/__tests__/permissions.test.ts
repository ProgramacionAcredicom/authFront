import { describe, expect, it } from "vitest";

import { OAUTH_PERMISSIONS, hasAccess } from "../permissions";

describe("hasAccess", () => {
  it("da acceso total a staff aunque no tenga oauth_perms", () => {
    expect(hasAccess({ is_staff: true, oauth_perms: [] }, OAUTH_PERMISSIONS.LIST_USERS)).toBe(true);
  });

  it("permite a no-staff cuando tiene el permiso requerido", () => {
    expect(
      hasAccess(
        { is_staff: false, oauth_perms: [OAUTH_PERMISSIONS.MOVEMENTS_ACCESS] },
        OAUTH_PERMISSIONS.MOVEMENTS_ACCESS,
      ),
    ).toBe(true);
  });

  it("niega acceso a no-staff cuando no tiene el permiso", () => {
    expect(
      hasAccess(
        { is_staff: false, oauth_perms: [OAUTH_PERMISSIONS.LIST_AGENCIES] },
        OAUTH_PERMISSIONS.LIST_USERS,
      ),
    ).toBe(false);
  });

  it("permite acceso a auditoria cuando el usuario tiene el permiso correspondiente", () => {
    expect(
      hasAccess(
        { is_staff: false, oauth_perms: [OAUTH_PERMISSIONS.AUDIT_LOG_ACCESS] },
        OAUTH_PERMISSIONS.AUDIT_LOG_ACCESS,
      ),
    ).toBe(true);
  });

  it("permite acceso a Mis solicitudes cuando el usuario tiene el permiso del módulo", () => {
    expect(
      hasAccess(
        { is_staff: false, oauth_perms: [OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS] },
        OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS,
      ),
    ).toBe(true);
  });

  it("permite listar sistemas de acceso cuando el usuario tiene el permiso correspondiente", () => {
    expect(
      hasAccess(
        { is_staff: false, oauth_perms: [OAUTH_PERMISSIONS.LIST_ACCESS_SYSTEMS] },
        OAUTH_PERMISSIONS.LIST_ACCESS_SYSTEMS,
      ),
    ).toBe(true);
  });

  it("permite ver el módulo de puestos cuando el usuario tiene ver_puesto", () => {
    expect(
      hasAccess(
        { is_staff: false, oauth_perms: [OAUTH_PERMISSIONS.VIEW_POSITION] },
        OAUTH_PERMISSIONS.VIEW_POSITION,
      ),
    ).toBe(true);
  });

  it("permite listar cards de puestos cuando el usuario tiene listar_puestos", () => {
    expect(
      hasAccess(
        { is_staff: false, oauth_perms: [OAUTH_PERMISSIONS.LIST_POSITIONS] },
        OAUTH_PERMISSIONS.LIST_POSITIONS,
      ),
    ).toBe(true);
  });
});
