import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminRequestsDetailPage from "@/app/admin/administracion-solicitudes/detail-page";
import MyRequestsDetailPage from "../detail-page";

const { useQueryMiAccesoRequestMock } = vi.hoisted(() => ({
  useQueryMiAccesoRequestMock: vi.fn(),
}));

vi.mock("@/hooks/mi-acceso/useQueryMiAccesoRequest", () => ({
  useQueryMiAccesoRequest: (id: number | null, enabled?: boolean) => useQueryMiAccesoRequestMock(id, enabled),
}));

function renderMyDetailPage(initialEntry = "/mi-acceso/detalle/101") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/mi-acceso/detalle/:id" element={<MyRequestsDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderAdminDetailPage(initialEntry = "/mi-acceso/administracion-solicitudes/detalle/201") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/mi-acceso/administracion-solicitudes/detalle/:id" element={<AdminRequestsDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MiAccesoRequestDetailPage", () => {
  beforeEach(() => {
    useQueryMiAccesoRequestMock.mockReset();
    useQueryMiAccesoRequestMock.mockReturnValue({
      data: {
        id: 101,
        code: "REQ-2026-001",
        request_type: "alta",
        request_type_display: "Alta",
        status: "aprobado",
        status_display: "Aprobado",
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
        updated_at: "2026-06-06T10:45:00.000Z",
        boss: {
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
        absence_type: null,
        start_date: null,
        end_date: null,
        reason: "Inducción",
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
            reference_user: {
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
            reference_user_id: 4,
            access_observation: "Usar perfil estándar",
            sort_order: 0,
            created_at: "2026-06-01T09:00:00.000Z",
          },
        ],
        status_history: [],
        pdf_download_url: "/solicitudes/101/pdf/",
      },
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("renderiza el detalle completo de la solicitud", () => {
    renderMyDetailPage();

    expect(useQueryMiAccesoRequestMock).toHaveBeenCalledWith(101, true);
    expect(screen.getByRole("heading", { name: "REQ-2026-001" })).toBeInTheDocument();
    expect(screen.getByText("Resumen general")).toBeInTheDocument();
    expect(screen.getByText("Ana Solís")).toBeInTheDocument();
    expect(screen.getByText("Luis Pérez")).toBeInTheDocument();
    expect(screen.getByText("Mario León")).toBeInTheDocument();
    expect(screen.getByText("Crear accesos iniciales para inducción.")).toBeInTheDocument();
    expect(screen.getAllByText("T24")).toHaveLength(2);
    expect(screen.getByText("Usar perfil estándar")).toBeInTheDocument();
  });

  it("renderiza la ruta administrativa reutilizando la misma vista base", () => {
    renderAdminDetailPage();

    expect(screen.getByRole("link", { name: /volver a administración de solicitudes/i })).toHaveAttribute(
      "href",
      "/mi-acceso/administracion-solicitudes",
    );
    expect(
      screen.getByText(/vista administrativa del detalle de la solicitud con el contexto completo del requerimiento\./i),
    ).toBeInTheDocument();
  });

  it("muestra estado de no encontrado cuando la API responde 404", () => {
    useQueryMiAccesoRequestMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: {
        response: {
          status: 404,
        },
      },
    });

    renderMyDetailPage();

    expect(screen.getByText("Solicitud no encontrada")).toBeInTheDocument();
  });

  it("muestra estado vacío cuando el id no es válido", () => {
    renderMyDetailPage("/mi-acceso/detalle/abc");

    expect(useQueryMiAccesoRequestMock).toHaveBeenCalledWith(null, false);
    expect(screen.getByText("Solicitud inválida")).toBeInTheDocument();
  });
});
