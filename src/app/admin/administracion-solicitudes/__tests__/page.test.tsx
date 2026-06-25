import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MiAccesoAdministrationPage from "../page";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

const {
  mutateMock,
  mutateStatusMock,
  useInfoUserQueryMock,
  useMutationDownloadMiAccesoPdfMock,
  useMutationUpdateMiAccesoRequestStatusMock,
  useQueryAdminMiAccesoRequestsMock,
} = vi.hoisted(() => ({
  mutateMock: vi.fn(),
  mutateStatusMock: vi.fn(),
  useInfoUserQueryMock: vi.fn(),
  useMutationDownloadMiAccesoPdfMock: vi.fn(),
  useMutationUpdateMiAccesoRequestStatusMock: vi.fn(),
  useQueryAdminMiAccesoRequestsMock: vi.fn(),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useInfoUserQuery: () => useInfoUserQueryMock(),
}));

vi.mock("@/hooks/mi-acceso/useMutationDownloadMiAccesoPdf", () => ({
  useMutationDownloadMiAccesoPdf: () => useMutationDownloadMiAccesoPdfMock(),
}));

vi.mock("@/hooks/mi-acceso/useMutationUpdateMiAccesoRequestStatus", () => ({
  useMutationUpdateMiAccesoRequestStatus: (options?: { onSuccess?: () => void }) =>
    useMutationUpdateMiAccesoRequestStatusMock(options),
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
    mutateMock.mockReset();
    mutateStatusMock.mockReset();
    useInfoUserQueryMock.mockReset();
    useMutationDownloadMiAccesoPdfMock.mockReset();
    useMutationUpdateMiAccesoRequestStatusMock.mockReset();
    useQueryAdminMiAccesoRequestsMock.mockReset();
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [
          OAUTH_PERMISSIONS.MANAGE_ACCESS_REQUESTS,
          OAUTH_PERMISSIONS.VIEW_ACCESS_REQUEST,
          OAUTH_PERMISSIONS.CHANGE_ACCESS_REQUEST_STATUS,
        ],
      },
      isLoading: false,
    });
    useMutationDownloadMiAccesoPdfMock.mockReturnValue({
      mutate: mutateMock,
      variables: undefined,
      isPending: false,
    });
    useMutationUpdateMiAccesoRequestStatusMock.mockImplementation(() => ({
      mutate: mutateStatusMock,
      variables: undefined,
      isPending: false,
    }));
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
    expect(screen.getByRole("link", { name: /ver detalle/i })).toHaveAttribute("href", "/mi-acceso/administracion-solicitudes/detalle/201");
    expect(screen.getByRole("button", { name: /descargar pdf/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cambiar estado/i })).toBeInTheDocument();
  });

  it("muestra suspensión en tipo cuando la solicitud de vacaciones viene con absence_type suspension", () => {
    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: {
        count: 1,
        results: [
          {
            id: 203,
            code: "REQ-2026-012",
            request_type: "vacaciones",
            request_type_display: "Vacaciones",
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
            detail_summary: "Bloqueo rango: 16/06/2026 al 24/06/2026",
            created_at: "2026-06-06T10:30:00.000Z",
            updated_at: "2026-06-06T10:30:00.000Z",
            boss: null,
            absence_type: "suspension",
            start_date: "2026-06-16",
            end_date: "2026-06-24",
            reason: "Proceso interno",
            additional_detail: "",
            status_changed_by: null,
            status_changed_at: null,
            system_lines: [],
            status_history: [],
            pdf_download_url: "/solicitudes/203/pdf/",
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("Suspensión")).toBeInTheDocument();
    expect(screen.queryByText("Vacaciones")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /descargar pdf/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cambiar estado/i })).toBeInTheDocument();
  });

  it("solo muestra descargar pdf para altas y bajas en administración", () => {
    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: {
        count: 4,
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
          {
            id: 202,
            code: "REQ-2026-011",
            request_type: "baja",
            request_type_display: "Baja",
            status: "registrado",
            status_display: "Registrado",
            requester: {
              id: 3,
              name: "Mario León",
              username: "mleon",
              email: "mario@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-012",
              role_name: "Supervisor",
              agency_name: "Sur",
              area_name: "Operaciones",
            },
            subject: {
              id: 4,
              name: "Carmen Díaz",
              username: "cdiaz",
              email: "carmen@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-013",
              role_name: "Oficial",
              agency_name: "Occidente",
              area_name: "Crédito",
            },
            detail_summary: "Sistema: Seguros",
            created_at: "2026-06-07T10:30:00.000Z",
            updated_at: "2026-06-07T10:30:00.000Z",
            boss: null,
            absence_type: null,
            start_date: null,
            end_date: null,
            reason: null,
            additional_detail: "",
            status_changed_by: null,
            status_changed_at: null,
            system_lines: [],
            status_history: [],
            pdf_download_url: "/solicitudes/202/pdf/",
          },
          {
            id: 203,
            code: "REQ-2026-012",
            request_type: "nuevo_permiso",
            request_type_display: "Nuevo permiso",
            status: "rechazado",
            status_display: "Rechazado",
            requester: {
              id: 5,
              name: "Carla Soto",
              username: "csoto",
              email: "carla@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-014",
              role_name: "Supervisor",
              agency_name: "Central",
              area_name: "Tecnología",
            },
            subject: {
              id: 6,
              name: "Pedro Cruz",
              username: "pcruz",
              email: "pedro@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-015",
              role_name: "Programador",
              agency_name: "Central",
              area_name: "Tecnología",
            },
            detail_summary: "Sistema: MCENLINEA",
            created_at: "2026-06-08T10:30:00.000Z",
            updated_at: "2026-06-08T10:30:00.000Z",
            boss: null,
            absence_type: null,
            start_date: null,
            end_date: null,
            reason: null,
            additional_detail: "",
            status_changed_by: null,
            status_changed_at: null,
            system_lines: [],
            status_history: [],
            pdf_download_url: "/solicitudes/203/pdf/",
          },
          {
            id: 204,
            code: "REQ-2026-013",
            request_type: "vacaciones",
            request_type_display: "Vacaciones",
            status: "registrado",
            status_display: "Registrado",
            requester: {
              id: 7,
              name: "Julia Rivas",
              username: "jrivas",
              email: "julia@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-016",
              role_name: "Jefe",
              agency_name: "Norte",
              area_name: "Operaciones",
            },
            subject: {
              id: 8,
              name: "Diego Morales",
              username: "dmorales",
              email: "diego@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-017",
              role_name: "Analista",
              agency_name: "Norte",
              area_name: "Operaciones",
            },
            detail_summary: "Bloqueo rango: 16/06/2026 al 24/06/2026",
            created_at: "2026-06-09T10:30:00.000Z",
            updated_at: "2026-06-09T10:30:00.000Z",
            boss: null,
            absence_type: "suspension",
            start_date: "2026-06-16",
            end_date: "2026-06-24",
            reason: "Proceso interno",
            additional_detail: "",
            status_changed_by: null,
            status_changed_at: null,
            system_lines: [],
            status_history: [],
            pdf_download_url: "/solicitudes/204/pdf/",
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getAllByRole("button", { name: /descargar pdf/i })).toHaveLength(2);
    expect(within(screen.getByText("REQ-2026-010").closest("tr")!).getByRole("button", { name: /descargar pdf/i })).toBeInTheDocument();
    expect(within(screen.getByText("REQ-2026-011").closest("tr")!).getByRole("button", { name: /descargar pdf/i })).toBeInTheDocument();
    expect(within(screen.getByText("REQ-2026-012").closest("tr")!).queryByRole("button", { name: /descargar pdf/i })).not.toBeInTheDocument();
    expect(within(screen.getByText("REQ-2026-013").closest("tr")!).queryByRole("button", { name: /descargar pdf/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /cambiar estado/i })).toHaveLength(4);
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

  it("mantiene cambiar estado cuando falta ver_solicitud", () => {
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [OAUTH_PERMISSIONS.MANAGE_ACCESS_REQUESTS, OAUTH_PERMISSIONS.CHANGE_ACCESS_REQUEST_STATUS],
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.queryByRole("button", { name: /descargar pdf/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cambiar estado/i })).toBeInTheDocument();
    expect(screen.getByText("Acciones")).toBeInTheDocument();
  });

  it("oculta toda la columna de acciones cuando faltan ver_solicitud y cambiar_estado_solicitud", () => {
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [OAUTH_PERMISSIONS.MANAGE_ACCESS_REQUESTS],
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.queryByRole("button", { name: /descargar pdf/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /cambiar estado/i })).not.toBeInTheDocument();
    expect(screen.queryByText("Acciones")).not.toBeInTheDocument();
  });

  it("descarga el PDF desde la tabla administrativa cuando tiene permiso", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /descargar pdf/i }));

    expect(mutateMock).toHaveBeenCalledWith({ id: 201, code: "REQ-2026-010" });
  });

  it("abre el modal para cambiar estado y muestra las opciones esperadas", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /cambiar estado/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/seleccioná el nuevo estado para req-2026-010/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /en proceso/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rechazado/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /aprobado/i })).toBeInTheDocument();
  });

  it("deshabilita el botón del estado actual dentro del modal", async () => {
    const user = userEvent.setup();

    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: {
        count: 1,
        results: [
          {
            id: 201,
            code: "REQ-2026-010",
            request_type: "alta",
            request_type_display: "Alta",
            status: "en_proceso",
            status_display: "En proceso",
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

    renderPage();

    await user.click(screen.getByRole("button", { name: /cambiar estado/i }));

    expect(screen.getByRole("button", { name: /en proceso/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /rechazado/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /aprobado/i })).not.toBeDisabled();
  });

  it("envía el nuevo estado y cierra el modal al completar la actualización", async () => {
    const user = userEvent.setup();

    useMutationUpdateMiAccesoRequestStatusMock.mockImplementation((options?: { onSuccess?: () => void }) => ({
      mutate: (variables: unknown) => {
        mutateStatusMock(variables);
        options?.onSuccess?.();
      },
      variables: undefined,
      isPending: false,
    }));

    renderPage();

    await user.click(screen.getByRole("button", { name: /cambiar estado/i }));
    await user.click(screen.getByRole("button", { name: /aprobado/i }));

    expect(mutateStatusMock).toHaveBeenCalledWith({
      id: 201,
      status: "aprobado",
      comment: "",
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("solo bloquea el botón de la fila que se está descargando en administración", () => {
    useMutationDownloadMiAccesoPdfMock.mockReturnValue({
      mutate: mutateMock,
      variables: { id: 201, code: "REQ-2026-010" },
      isPending: true,
    });
    useQueryAdminMiAccesoRequestsMock.mockReturnValue({
      data: {
        count: 2,
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
          {
            id: 202,
            code: "REQ-2026-011",
            request_type: "baja",
            request_type_display: "Baja",
            status: "registrado",
            status_display: "Registrado",
            requester: {
              id: 3,
              name: "Mario León",
              username: "mleon",
              email: "mario@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-012",
              role_name: "Supervisor",
              agency_name: "Sur",
              area_name: "Operaciones",
            },
            subject: {
              id: 4,
              name: "Carmen Díaz",
              username: "cdiaz",
              email: "carmen@example.com",
              cif: null,
              executive_number: null,
              employee_id: "E-013",
              role_name: "Oficial",
              agency_name: "Occidente",
              area_name: "Crédito",
            },
            detail_summary: "Sistema: Seguros",
            created_at: "2026-06-07T10:30:00.000Z",
            updated_at: "2026-06-07T10:30:00.000Z",
            boss: null,
            absence_type: null,
            start_date: null,
            end_date: null,
            reason: null,
            additional_detail: "",
            status_changed_by: null,
            status_changed_at: null,
            system_lines: [],
            status_history: [],
            pdf_download_url: "/solicitudes/202/pdf/",
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });

    renderPage();

    const pdfButtons = screen.getAllByRole("button", { name: /descargar pdf/i });
    expect(pdfButtons[0]).toBeDisabled();
    expect(pdfButtons[1]).not.toBeDisabled();
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
