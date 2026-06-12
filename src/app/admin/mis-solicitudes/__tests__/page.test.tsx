import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MiAccesoPage from "../page";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

const { mutateMock, useQueryMiAccesoRequestsMock, useMutationDownloadMiAccesoPdfMock, useInfoUserQueryMock } = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  useQueryMiAccesoRequestsMock: vi.fn(),
  useMutationDownloadMiAccesoPdfMock: vi.fn(),
  useInfoUserQueryMock: vi.fn(),
}));

const { toast } = vi.hoisted(() => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/mi-acceso/useQueryMiAccesoRequests", () => ({
  useQueryMiAccesoRequests: (params: unknown) => useQueryMiAccesoRequestsMock(params),
}));

vi.mock("@/hooks/mi-acceso/useMutationDownloadMiAccesoPdf", () => ({
  useMutationDownloadMiAccesoPdf: () => useMutationDownloadMiAccesoPdfMock(),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useInfoUserQuery: () => useInfoUserQueryMock(),
}));

vi.mock("sonner", () => ({
  toast,
}));

function renderPage(initialEntry = "/mi-acceso") {
  window.history.pushState({}, "", initialEntry);

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <NuqsAdapter>
        <MiAccesoPage />
      </NuqsAdapter>
    </MemoryRouter>,
  );
}

describe("MiAccesoPage", () => {
  beforeEach(() => {
    mutateMock.mockReset();
    toast.error.mockReset();
    useInfoUserQueryMock.mockReset();
    useMutationDownloadMiAccesoPdfMock.mockReturnValue({
      mutate: mutateMock,
      variables: undefined,
      isPending: false,
    });
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [
          OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS,
          OAUTH_PERMISSIONS.CREATE_ACCESS_REQUEST,
          OAUTH_PERMISSIONS.VIEW_ACCESS_REQUEST,
        ],
      },
      isLoading: false,
    });
    useQueryMiAccesoRequestsMock.mockReturnValue({
      data: {
        count: 2,
        results: [
          {
            id: 101,
            code: "REQ-2026-001",
            request_type: "alta",
            request_type_display: "Alta",
            status: "aprobado",
            status_display: "Aprobado",
            requester: null,
            subject: {
              id: 12,
              name: "Carlos Estuardo Alvarado",
              username: "calvarado",
              email: "carlos@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-001",
              role_name: "Asesor de Microcrédito",
              agency_name: "Central",
              area_name: "Microcrédito",
            },
            detail_summary: "Sistema: T24",
            created_at: "2026-06-01T09:00:00.000Z",
            updated_at: "2026-06-01T09:00:00.000Z",
            boss: null,
            absence_type: null,
            start_date: null,
            end_date: null,
            reason: null,
            additional_detail: "Crear accesos iniciales para inducción.",
            status_changed_by: null,
            status_changed_at: null,
            system_lines: [
              {
                id: 1,
                system: {
                  id: 501,
                  code: "T24",
                  name: "T24",
                  description: "",
                  is_active: true,
                  system_kind: "form",
                  created_at: "2026-06-01T09:00:00.000Z",
                  updated_at: "2026-06-01T09:00:00.000Z",
                },
                system_id: 501,
                reference_user: null,
                reference_user_id: null,
                access_observation: "",
                sort_order: 0,
                created_at: "2026-06-01T09:00:00.000Z",
              },
            ],
            status_history: [],
            pdf_download_url: "/solicitudes/101/pdf/",
          },
          {
            id: 102,
            code: "REQ-2026-002",
            request_type: "baja",
            request_type_display: "Baja",
            status: "registrado",
            status_display: "Registrado",
            requester: null,
            subject: {
              id: 13,
              name: "Andrea Paz",
              username: "apaz",
              email: "andrea@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-002",
              role_name: "Analista de cartera",
              agency_name: "Norte",
              area_name: "Créditos",
            },
            detail_summary: "Sistema: Seguros",
            created_at: "2026-06-03T11:45:00.000Z",
            updated_at: "2026-06-03T11:45:00.000Z",
            boss: null,
            absence_type: null,
            start_date: null,
            end_date: null,
            reason: null,
            additional_detail: "",
            status_changed_by: null,
            status_changed_at: null,
            system_lines: [
              {
                id: 2,
                system: {
                  id: 502,
                  code: "SEG",
                  name: "Seguros",
                  description: "",
                  is_active: true,
                  system_kind: "form",
                  created_at: "2026-06-03T11:45:00.000Z",
                  updated_at: "2026-06-03T11:45:00.000Z",
                },
                system_id: 502,
                reference_user: null,
                reference_user_id: null,
                access_observation: "",
                sort_order: 0,
                created_at: "2026-06-03T11:45:00.000Z",
              },
            ],
            status_history: [],
            pdf_download_url: "/solicitudes/102/pdf/",
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });
  });

  it("renderiza el listado remoto con CTA principal", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: /mis solicitudes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /requerimiento accesos/i })).toHaveAttribute("href", "/mi-acceso/requerimiento-accesos");
    expect(screen.getByRole("link", { name: /nueva solicitud/i })).toHaveAttribute("href", "/mi-acceso/nueva");
    expect(screen.getByText("REQ-2026-001")).toBeInTheDocument();
    expect(screen.getByText("REQ-2026-002")).toBeInTheDocument();
    expect(screen.getAllByText("Sistema")).toHaveLength(2);
    expect(screen.getByText("T24")).toBeInTheDocument();
    expect(screen.getAllByText("Detalle adicional")).toHaveLength(2);
    expect(screen.getByText("Crear accesos iniciales para inducción.")).toBeInTheDocument();
  });

  it("oculta los CTAs de creación cuando falta crear_solicitud", () => {
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS, OAUTH_PERMISSIONS.VIEW_ACCESS_REQUEST],
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.queryByRole("link", { name: /requerimiento accesos/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /nueva solicitud/i })).not.toBeInTheDocument();
  });

  it("muestra estado informativo cuando falta ver_solicitud", () => {
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS, OAUTH_PERMISSIONS.CREATE_ACCESS_REQUEST],
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.getByText("Sin permisos para consultar solicitudes")).toBeInTheDocument();
    expect(screen.queryByText("REQ-2026-001")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /descargar pdf/i })).not.toBeInTheDocument();
  });

  it("usa total cuando el backend no envía count en el listado", async () => {
    useQueryMiAccesoRequestsMock.mockReturnValue({
      data: {
        total: 1,
        page: 1,
        page_size: 10,
        total_pages: 1,
        results: [
          {
            id: 104,
            code: "REQ-2026-004",
            request_type: "alta",
            request_type_display: "Alta",
            status: "registrado",
            status_display: "Registrado",
            requester: null,
            subject: {
              id: 15,
              name: "Luis Méndez",
              username: "lmendez",
              email: "luis@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-004",
              role_name: "Oficial",
              agency_name: "Sur",
              area_name: "Crédito",
            },
            detail_summary: "Sistemas: MCENLINEA, T24",
            created_at: "2026-06-05T13:01:28.695474",
            updated_at: "2026-06-05T13:01:28.695512",
            boss: null,
            absence_type: null,
            start_date: null,
            end_date: null,
            reason: null,
            additional_detail: null,
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(await screen.findByText("REQ-2026-004")).toBeInTheDocument();
    expect(screen.queryByText(/no hay solicitudes registradas/i)).not.toBeInTheDocument();
  });

  it("mantiene visible la búsqueda cuando no hay resultados", async () => {
    useQueryMiAccesoRequestsMock.mockReturnValue({
      data: {
        count: 0,
        results: [],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderPage("/mi-acceso?search=dsada");

    expect(await screen.findByDisplayValue("dsada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset filters/i })).toBeInTheDocument();
    expect(screen.queryByText("REQ-2026-001")).not.toBeInTheDocument();
    expect(screen.queryByText(/creá tu primera solicitud/i)).not.toBeInTheDocument();
  });

  it("no deja el botón cargando cuando la mutación ya terminó", () => {
    useMutationDownloadMiAccesoPdfMock.mockReturnValueOnce({
      mutate: mutateMock,
      variables: { id: 101, code: "REQ-2026-001" },
      isPending: false,
    });

    renderPage();

    expect(screen.getAllByRole("button", { name: /descargar pdf/i })[0]).not.toBeDisabled();
  });

  it("solo bloquea el botón mientras el pdf sigue descargando", () => {
    useMutationDownloadMiAccesoPdfMock.mockReturnValueOnce({
      mutate: mutateMock,
      variables: { id: 101, code: "REQ-2026-001" },
      isPending: true,
    });

    renderPage();

    expect(screen.getAllByRole("button", { name: /descargar pdf/i })[0]).toBeDisabled();
    expect(screen.getAllByRole("button", { name: /descargar pdf/i })[1]).not.toBeDisabled();
  });

  it("tolera respuestas resumidas del listado sin system_lines", () => {
    useQueryMiAccesoRequestsMock.mockReturnValueOnce({
      data: {
        count: 1,
        results: [
          {
            id: 103,
            code: "REQ-2026-003",
            request_type: "alta",
            request_type_display: "Alta",
            status: "registrado",
            status_display: "Registrado",
            requester: null,
            subject: {
              id: 14,
              name: "María López",
              username: "mlopez",
              email: "maria@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-003",
              role_name: "Analista",
              agency_name: "Central",
              area_name: "Operaciones",
            },
            detail_summary: "Sistemas: MCENLINEA, T24",
            created_at: "2026-06-05T13:01:28.695474",
            updated_at: "2026-06-05T13:01:28.695512",
            boss: null,
            absence_type: null,
            start_date: null,
            end_date: null,
            reason: null,
            additional_detail: null,
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("REQ-2026-003")).toBeInTheDocument();
    expect(screen.getByText("Detalle adicional")).toBeInTheDocument();
    expect(screen.getByText("Sistemas: MCENLINEA, T24")).toBeInTheDocument();
  });

  it("descarga el PDF usando el id real de la solicitud", async () => {
    const user = userEvent.setup();

    renderPage();

    const pdfButtons = await screen.findAllByRole("button", { name: /descargar pdf/i });
    await user.click(pdfButtons[0]);

    expect(mutateMock).toHaveBeenCalledWith({ id: 101, code: "REQ-2026-001" });
  });
});
