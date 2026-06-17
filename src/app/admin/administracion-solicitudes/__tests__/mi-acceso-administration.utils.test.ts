import { describe, expect, it } from "vitest";

import { getAdminRequestsOrdering } from "../mi-acceso-administration.utils";

describe("getAdminRequestsOrdering", () => {
  it("mapea columnas soportadas al ordering del backend", () => {
    expect(getAdminRequestsOrdering([{ id: "code", desc: false }])).toBe("code");
    expect(getAdminRequestsOrdering([{ id: "type", desc: true }])).toBe("-request_type");
    expect(getAdminRequestsOrdering([{ id: "status", desc: false }])).toBe("status");
    expect(getAdminRequestsOrdering([{ id: "createdAt", desc: true }])).toBe("-created_at");
  });

  it("ignora columnas sin mapeo o ausencia de sorting", () => {
    expect(getAdminRequestsOrdering([{ id: "requesterName", desc: false }])).toBeUndefined();
    expect(getAdminRequestsOrdering([])).toBeUndefined();
    expect(getAdminRequestsOrdering(undefined)).toBeUndefined();
  });
});
