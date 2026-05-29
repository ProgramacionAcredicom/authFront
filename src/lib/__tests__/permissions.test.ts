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
});
