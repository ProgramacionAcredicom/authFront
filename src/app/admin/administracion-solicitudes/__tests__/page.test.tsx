import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MiAccesoAdministrationPage from "../page";

const { useQueryAdminMiAccesoRequestsMock } = vi.hoisted(() => ({
  useQueryAdminMiAccesoRequestsMock: vi.fn(),
}));

vi.mock("@/hooks/mi-acceso/useQueryAdminMiAccesoRequests", () => ({
  useQueryAdminMiAccesoRequests: (params: unknown) => useQueryAdminMiAccesoRequestsMock(params),
}));

function renderPage(initialEntry = "/mi-acceso/administracion-solicitudes") {
  window.history.pushState({}, "", initialEntry);

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <NuqsAdapter>
        <MiAccesoAdministrationPage />
      </NuqsAdapter>
    </MemoryRouter>,
  );
}

describe("MiAccesoAdministrationPage", () => {
  beforeEach(() => {
    useQueryAdminMiAccesoRequestsMock.mockReset();
    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: {
        count: 1,
        results: [
          {
            id: 201,
            code: "REQ-2026-010",
            request_type: "alta",
            request_type_display: "Alta",
            status: "registrado",
            status_display: "Registrado",
            requester: {
              id: 1,
              name: "Ana Solís",
              username: "asolis",
              email: "ana@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-010",
              role_name: "Jefe de agencia",
              agency_name: "Central",
              area_name: "Operaciones",
            },
            subject: {
              id: 2,
              name: "Luis Pérez",
              username: "lperez",
              email: "luis@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-011",
              role_name: "Analista",
              agency_name: "Norte",
              area_name: "Crédito",
            },
            detail_summary: "Sistema: T24",
            created_at: "2026-06-06T10:30:00.000Z",
            updated_at: "2026-06-06T10:30:00.000Z",
            boss: null,
            absence_type: null,
            start_date: null,
            end_date: null,
            reason: null,
            additional_detail: "Requiere acceso inicial",
            status_changed_by: null,
            status_changed_at: null,
            system_lines: [],
            status_history: [],
            pdf_download_url: "/solicitudes/201/pdf/",
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });
  });

  it("renderiza la bandeja administrativa con la tabla reutilizable", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: /administraci.n de solicitudes/i })).toBeInTheDocument();
    expect(screen.getByText("REQ-2026-010")).toBeInTheDocument();
    expect(screen.getByText("Ana Solís")).toBeInTheDocument();
    expect(screen.getByText("Luis Pérez")).toBeInTheDocument();
    expect(screen.getByText("Requiere acceso inicial")).toBeInTheDocument();
  });

  it("traduce query params del URL a parámetros de API", () => {
    const sorting = encodeURIComponent(JSON.stringify([{ id: "createdAt", desc: true }]));

    renderPage(`/mi-acceso/administracion-solicitudes?page=3&perPage=15&search=ana&status=registrado&type=alta&sort=${sorting}`);

    expect(useQueryAdminMiAccesoRequestsMock).toHaveBeenLastCalledWith({
      page: 3,
      page_size: 15,
      search: "ana",
      status: "registrado",
      request_type: "alta",
      ordering: "-created_at",
    });
  });

  it("muestra acceso denegado cuando la API responde 403", () => {
    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: { response: { status: 403 } },
    });

    renderPage();

    expect(screen.getByText(/sin permisos para administrar solicitudes/i)).toBeInTheDocument();
  });

  it("muestra error genérico cuando falla la carga por otra causa", () => {
    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error("boom"),
    });

    renderPage();

    expect(screen.getByText(/error al cargar solicitudes/i)).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("muestra empty state cuando no hay registros ni filtros activos", () => {
    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText(/no hay solicitudes registradas/i)).toBeInTheDocument();
  });

  it("mantiene visible la búsqueda cuando no hay resultados por filtros", async () => {
    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderPage("/mi-acceso/administracion-solicitudes?search=sin-coincidencias");

    expect(await screen.findByDisplayValue("sin-coincidencias")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset filters/i })).toBeInTheDocument();
    expect(screen.queryByText("REQ-2026-010")).not.toBeInTheDocument();
  });
});
