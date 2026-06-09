import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAdminMiAccesoRequests } from "../mi-acceso.services";

vi.mock("../../configAxios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("mi-acceso services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("consulta la bandeja administrativa usando /solicitudes/admin/", async () => {
    const apiServices = await import("../../configAxios");
    const mockResponse = {
      data: {
        count: 1,
        results: [],
      },
    };

    (apiServices.default.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const result = await getAdminMiAccesoRequests({
      page: 2,
      page_size: 15,
      search: "ana",
      status: "registrado",
      request_type: "alta",
      ordering: "-created_at",
    });

    expect(apiServices.default.get).toHaveBeenCalledWith("/solicitudes/admin/", {
      params: {
        page: 2,
        page_size: 15,
        search: "ana",
        status: "registrado",
        request_type: "alta",
        ordering: "-created_at",
      },
    });
    expect(result).toEqual(mockResponse.data);
  });
});
