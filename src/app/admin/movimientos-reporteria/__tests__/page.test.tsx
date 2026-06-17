import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";
import type { MovementLogApi } from "@/interfaces/movements.interfaces";

import MovimientosPage from "../page";

const { toast, queryMock, reportMutationState, useQueryMovementsMock } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  queryMock: {
    data: [] as MovementLogApi[],
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  },
  reportMutationState: {
    mutateAsync: vi.fn(),
    isPending: false,
  },
  useQueryMovementsMock: vi.fn(),
}));

const collaboratorResults: CollaboratorResult[] = [
  {
    id: 12,
    dpi: "1234567890123",
    cif: "456",
    name: "Ana Pérez",
    username: "aperez",
    user_type: "USUARIO" as CollaboratorResult["user_type"],
    agency: { id: 1, code: "CEN", name: "Central", chif: null, state: true, no_colaboradores: 1 },
    role: { id: 2, role: "Analista", state: true },
    areas: [],
    is_active: true,
    is_staff: false,
    is_superuser: false,
    picture: null,
    email: "ana@example.com",
  },
];

vi.mock("sonner", () => ({ toast }));
vi.mock("@/hooks/movements/useQueryMovements", () => ({
  useQueryMovements: (params: unknown) => useQueryMovementsMock(params),
}));
vi.mock("@/hooks/movements/useMutationMovementReport", () => ({
  useMutationMovementReport: () => ({
    mutation: reportMutationState,
    isLoading: reportMutationState.isPending,
  }),
}));
vi.mock("@/hooks/colaboradores/useInfiniteColaboradores", () => ({
  useInfiniteColaboradores: () => ({
    data: { pages: [{ results: collaboratorResults }] },
    isLoading: false,
    isError: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useInfoUserQuery: () => ({
    data: {
      is_staff: true,
      oauth_perms: [],
    },
  }),
  useHasPermission: () => ({
    hasPermission: true,
  }),
}));

vi.mock("../movements-report-utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../movements-report-utils")>();

  return {
    ...actual,
    getRecentMovementsRange: () => ({
      fechaInicio: "2026-05-21",
      fechaFin: "2026-05-27",
    }),
  };
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/movimientos"]}>
      <NuqsAdapter>
        <MovimientosPage />
      </NuqsAdapter>
    </MemoryRouter>,
  );
}

describe("MovimientosPage", () => {
  beforeEach(() => {
    vi.useRealTimers();
    toast.success.mockReset();
    toast.error.mockReset();
    reportMutationState.mutateAsync.mockReset();
    reportMutationState.isPending = false;
    queryMock.data = [
      {
        id: 10,
        tipo_accion: "MOVIMIENTO",
        fecha_accion: "2026-05-27",
        current_value: "Agencia Central / Analista",
        new_value: "Agencia Norte / Supervisor",
        affected_user: { id: 5, name: "Ana Pérez", username: "aperez" },
        created_by: { id: 1, name: "Carlos Admin", username: "cadmin" },
        comment: "Ascenso aprobado",
        is_apply: true,
      },
    ];
    queryMock.isLoading = false;
    queryMock.isFetching = false;
    queryMock.isError = false;
    queryMock.error = null;
    useQueryMovementsMock.mockImplementation(() => queryMock);
  });

  it("carga automáticamente los últimos 7 días al ingresar", () => {
    renderPage();

    expect(useQueryMovementsMock).toHaveBeenCalledWith({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
    });
    expect(screen.queryByText("Filtros de reportería")).not.toBeInTheDocument();
    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enviar reporte/i })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /Consultar movimientos/i })).not.toBeInTheDocument();
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Fin")).toBeInTheDocument();
    expect(screen.getByText("Asignación actual")).toBeInTheDocument();
    expect(screen.getByText("Nueva asignación")).toBeInTheDocument();
    expect(screen.getAllByText("Agencia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Puesto").length).toBeGreaterThan(0);
  });

  it("aplica múltiples tipos al query de movimientos con debounce", async () => {
    const user = userEvent.setup();
    renderPage();

    const typeTrigger = screen.getByRole("combobox", { name: /Tipo de movimiento/i });
    await user.click(typeTrigger);
    await user.click(screen.getByText("Altas"));
    await user.click(screen.getByRole("option", { name: "Bajas" }));
    await user.keyboard("{Escape}");

    expect(useQueryMovementsMock).toHaveBeenLastCalledWith({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
    });

    await waitFor(() => expect(useQueryMovementsMock).toHaveBeenLastCalledWith({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
      tipo: ["ALTA", "BAJA"],
    }), { timeout: 1200 });
  });

  it("permite limpiar tipos seleccionados y volver a consultar sin tipo", async () => {
    const user = userEvent.setup();
    renderPage();

    const typeTrigger = screen.getByRole("combobox", { name: /Tipo de movimiento/i });
    await user.click(typeTrigger);
    await user.click(screen.getByText("Altas"));
    await user.keyboard("{Escape}");

    await waitFor(() => expect(useQueryMovementsMock).toHaveBeenLastCalledWith({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
      tipo: ["ALTA"],
    }), { timeout: 1200 });

    await user.click(typeTrigger);
    await user.click(screen.getByRole("option", { name: "Altas" }));
    await user.keyboard("{Escape}");

    await waitFor(() => expect(useQueryMovementsMock).toHaveBeenLastCalledWith({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
    }), { timeout: 1200 });
  });

  it("mantiene la búsqueda por nombre sin botón de consulta", async () => {
    renderPage();

    expect(screen.getByPlaceholderText("Buscar colaborador...")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Consultar movimientos/i })).not.toBeInTheDocument();
  });

  it("filtra localmente las filas de la tabla con la búsqueda", async () => {
    const user = userEvent.setup();

    queryMock.data = [
      {
        id: 10,
        tipo_accion: "MOVIMIENTO",
        fecha_accion: "2026-05-27",
        current_value: "Agencia Central / Analista",
        new_value: "Agencia Norte / Supervisor",
        affected_user: { id: 5, name: "Ana Pérez", username: "aperez" },
        created_by: { id: 1, name: "Carlos Admin", username: "cadmin" },
        comment: "Ascenso aprobado",
        is_apply: true,
      },
      {
        id: 11,
        tipo_accion: "BAJA",
        fecha_accion: "2026-05-27",
        current_value: "Sin valor actual",
        new_value: "Sin nuevo valor",
        affected_user: { id: 6, name: "Luis Gómez", username: "lgomez" },
        created_by: { id: 2, name: "Moises Aldair Vasquez Gonzalez", username: "mcmavasquez" },
        comment: "Baja administrativa",
        is_apply: true,
      },
    ];

    renderPage();

    await user.type(screen.getByPlaceholderText("Buscar colaborador..."), "moises");

    await waitFor(() => {
      expect(screen.getByText("Moises Aldair Vasquez Gonzalez")).toBeInTheDocument();
      expect(screen.queryByText("Carlos Admin")).not.toBeInTheDocument();
    });
  });

  it("envía la reportería con múltiples tipos seleccionados cuando existen", async () => {
    const user = userEvent.setup();
    reportMutationState.mutateAsync.mockResolvedValueOnce({ ok: true });

    renderPage();

    const typeTrigger = screen.getByRole("combobox", { name: /Tipo de movimiento/i });
    await user.click(typeTrigger);
    await user.click(screen.getByText("Altas"));
    await user.click(screen.getByRole("option", { name: "Bajas" }));
    await user.keyboard("{Escape}");

    await waitFor(() => expect(useQueryMovementsMock).toHaveBeenLastCalledWith({
      fecha_inicio: "2026-05-21",
      fecha_fin: "2026-05-27",
      tipo: ["ALTA", "BAJA"],
    }), { timeout: 1200 });

    await user.click(screen.getByRole("combobox", { name: /Seleccionar colaboradores destinatarios/i }));
    await user.click(await screen.findByRole("option", { name: /Ana Pérez/i }));
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /Enviar reporte/i }));

    await waitFor(() => {
      expect(reportMutationState.mutateAsync).toHaveBeenCalledWith({
        fecha_inicio: "2026-05-21",
        fecha_fin: "2026-05-27",
        colaborador_ids: [12],
        tipo: ["ALTA", "BAJA"],
      });
    });
  });
});
