import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

import MiAccesoPage from "../page";
import MiAccesoNewRequestPage from "../new-request-page";

const { mutateAsyncMock, useQueryMiAccesoRequestsMock, useHasPermissionMock, useInfoUserQueryMock } = vi.hoisted(() => ({
  mutateAsyncMock: vi.fn(),
  useQueryMiAccesoRequestsMock: vi.fn(),
  useHasPermissionMock: vi.fn(),
  useInfoUserQueryMock: vi.fn(),
}));

const collaborators: CollaboratorResult[] = [
  {
    id: 12,
    dpi: "1234567890123",
    cif: "456",
    name: "Ana Pérez",
    username: "aperez",
    user_type: "USUARIO" as CollaboratorResult["user_type"],
    agency: { id: 1, code: "CEN", name: "Central", chif: null, state: true, no_colaboradores: 1 },
    role: { id: 2, role: "Analista", state: true },
    areas: [{ id: 5, code: "TI", name: "Tecnología", chif: null, state: true }],
    is_active: true,
    is_staff: false,
    is_superuser: false,
    picture: null,
    email: "ana@example.com",
  },
  {
    id: 13,
    dpi: "1234567890124",
    cif: "457",
    name: "Luis Gómez",
    username: "lgomez",
    user_type: "USUARIO" as CollaboratorResult["user_type"],
    agency: { id: 2, code: "NOR", name: "Norte", chif: null, state: true, no_colaboradores: 1 },
    role: { id: 3, role: "Supervisor", state: true },
    areas: [{ id: 6, code: "OPS", name: "Operaciones", chif: null, state: true }],
    is_active: true,
    is_staff: false,
    is_superuser: false,
    picture: null,
    email: "luis@example.com",
  },
];

const { toast } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast,
}));

vi.mock("@/hooks/colaboradores/useInfiniteColaboradores", () => ({
  useInfiniteColaboradores: () => ({
    data: { pages: [{ results: collaborators }] },
    isLoading: false,
    isError: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
}));

vi.mock("@/hooks/mi-acceso/useQueryAccessSystems", () => ({
  useQueryAccessSystems: () => ({
    data: {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 501,
          code: "T24",
          name: "T24",
          description: "",
          is_active: true,
          system_kind: "form",
          created_at: "2026-06-01T09:00:00.000Z",
          updated_at: "2026-06-01T09:00:00.000Z",
        },
        {
          id: 502,
          code: "SEG",
          name: "Seguros",
          description: "",
          is_active: true,
          system_kind: "form",
          created_at: "2026-06-03T11:45:00.000Z",
          updated_at: "2026-06-03T11:45:00.000Z",
        },
      ],
    },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/hooks/mi-acceso/useMutationCreateMiAccesoRequest", () => ({
  useMutationCreateMiAccesoRequest: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  }),
}));

vi.mock("@/hooks/mi-acceso/useQueryMiAccesoRequests", () => ({
  useQueryMiAccesoRequests: (params: unknown) => useQueryMiAccesoRequestsMock(params),
}));

vi.mock("@/hooks/mi-acceso/useMutationDownloadMiAccesoPdf", () => ({
  useMutationDownloadMiAccesoPdf: () => ({
    mutate: vi.fn(),
    variables: undefined,
  }),
}));

vi.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: false,
  }),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useHasPermission: (permission: string) => useHasPermissionMock(permission),
  useInfoUserQuery: () => useInfoUserQueryMock(),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/mi-acceso/nueva"]}>
      <NuqsAdapter>
        <Routes>
          <Route path="/mi-acceso" element={<MiAccesoPage />} />
          <Route path="/mi-acceso/nueva" element={<MiAccesoNewRequestPage />} />
        </Routes>
      </NuqsAdapter>
    </MemoryRouter>,
  );
}

describe("MiAccesoNewRequestPage", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
    useHasPermissionMock.mockReset();
    useInfoUserQueryMock.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
    mutateAsyncMock.mockResolvedValue({ id: 999 });
    useHasPermissionMock.mockImplementation(() => ({
      hasPermission: true,
    }));
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
      data: { count: 0, results: [] },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    });
  });

  it("renderiza el formulario completo y permite agregar/eliminar sistemas", async () => {
    const user = userEvent.setup();

    renderPage();

    expect(screen.getByRole("heading", { name: /nueva solicitud de acceso/i })).toBeInTheDocument();
    expect(screen.queryByText("T24")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /agregar sistema/i })).toBeInTheDocument();
    expect(screen.getByText("0/500")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /agregar sistema/i }));
    expect(screen.getByText("Sistema 1")).toBeInTheDocument();
    expect(screen.getByText(/seleccionar sistema/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /eliminar sistema 1/i }));
    expect(screen.queryByText("Sistema 1")).not.toBeInTheDocument();
  });

  it("valida colaborador, jefe inmediato y filas incompletas de sistemas", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /agregar sistema/i }));
    await user.click(screen.getByRole("button", { name: /guardar solicitud/i }));

    expect(screen.getByText("Selecciona un colaborador.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona un jefe inmediato.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona un sistema.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona un colaborador de referencia.")).toBeInTheDocument();
    expect(screen.queryByText("Ingresa una observación.")).not.toBeInTheDocument();
  });

  it("oculta en la siguiente fila los sistemas que ya fueron seleccionados", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /agregar sistema/i }));
    await user.click(screen.getByRole("combobox", { name: /^sistema/i }));
    await user.click(screen.getAllByText("T24")[1]);

    await user.click(screen.getByRole("button", { name: /agregar sistema/i }));
    await user.click(screen.getAllByRole("combobox", { name: /^sistema/i })[1]);

    const secondSystemOptions = within(screen.getByRole("listbox"));

    expect(secondSystemOptions.queryByRole("option", { name: "T24" })).not.toBeInTheDocument();
    expect(secondSystemOptions.getByRole("option", { name: "Seguros" })).toBeInTheDocument();
  });

  it("crea la solicitud en backend con observación opcional y regresa al listado", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /agregar sistema/i }));

    await user.click(screen.getByRole("combobox", { name: /solicitante/i }));
    await user.click(screen.getByText("Ana Pérez"));

    await user.click(screen.getByRole("combobox", { name: /jefe inmediato/i }));
    await user.click(screen.getByText("Luis Gómez"));

    await user.click(screen.getByRole("combobox", { name: /^sistema/i }));
    await user.click(screen.getAllByText("T24")[1]);

    await user.click(screen.getByRole("combobox", { name: /referencia para sistema 1/i }));
    await user.click(screen.getAllByText("Ana Pérez").at(-1)!);

    await user.type(screen.getByLabelText("Detalle adicional"), "Acceso inicial para incorporación.");
    await user.click(screen.getByRole("button", { name: /guardar solicitud/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /mis solicitudes/i })).toBeInTheDocument();
    });

    expect(toast.success).toHaveBeenCalled();
    expect(mutateAsyncMock).toHaveBeenCalledWith({
      request_type: "alta",
      subject_user_id: 12,
      boss_user_id: 13,
      additional_detail: "Acceso inicial para incorporación.",
      systems: [
        {
          system_id: 501,
          reference_user_id: 12,
          access_observation: "",
          sort_order: 0,
        },
      ],
    });
  });

  it("no muestra el área dentro de los selects de búsqueda", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("combobox", { name: /solicitante/i }));

    expect(screen.getByText("Analista")).toBeInTheDocument();
    expect(screen.getByText("Central")).toBeInTheDocument();
    expect(screen.queryByText("Tecnología")).not.toBeInTheDocument();
  });

  it("no muestra el área en las cards de colaborador y jefe inmediato", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("combobox", { name: /solicitante/i }));
    await user.click(screen.getByText("Ana Pérez"));

    await user.click(screen.getByRole("combobox", { name: /jefe inmediato/i }));
    await user.click(screen.getByText("Luis Gómez"));

    expect(screen.getByText("Analista")).toBeInTheDocument();
    expect(screen.getByText("Supervisor")).toBeInTheDocument();
    expect(screen.queryByText("Tecnología")).not.toBeInTheDocument();
    expect(screen.queryByText("Operaciones")).not.toBeInTheDocument();
    expect(screen.queryByText(/departamento\/área/i)).not.toBeInTheDocument();
  });

  it("muestra error cuando el requerimiento adicional excede 500 caracteres", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.type(screen.getByLabelText("Detalle adicional"), "a".repeat(501));
    await user.click(screen.getByRole("button", { name: /guardar solicitud/i }));

    expect(screen.getByText("El requerimiento adicional no puede exceder 500 caracteres.")).toBeInTheDocument();
  });

  it("deshabilita los selects de usuarios cuando falta listar_usuarios_oauth", () => {
    useHasPermissionMock.mockImplementation((permission: string) => ({
      hasPermission: permission !== OAUTH_PERMISSIONS.LIST_USERS,
    }));

    renderPage();

    expect(screen.getByRole("combobox", { name: /solicitante/i })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: /jefe inmediato/i })).toBeDisabled();
  });

  it("deshabilita el select de sistema cuando falta listar_sistemas_acceso", async () => {
    const user = userEvent.setup();

    useHasPermissionMock.mockImplementation((permission: string) => ({
      hasPermission: permission !== OAUTH_PERMISSIONS.LIST_ACCESS_SYSTEMS,
    }));

    renderPage();

    await user.click(screen.getByRole("button", { name: /agregar sistema/i }));

    const systemSelect = screen.getByRole("combobox", { name: /^sistema/i });
    expect(systemSelect).toBeDisabled();
    expect(systemSelect).toHaveTextContent("Sin permiso para listar sistemas");
    expect(screen.getByText("No tienes permisos para listar sistemas de acceso.")).toBeInTheDocument();
  });
});
