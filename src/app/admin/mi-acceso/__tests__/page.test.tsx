import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import MiAccesoPage from "../page";

const { toast, mutationState, useInfoUserQueryMock } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  mutationState: {
    mutateAsync: vi.fn(),
    isPending: false,
  },
  useInfoUserQueryMock: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast,
}));

vi.mock("@/hooks/agencias/useQueryAgencias", () => ({
  useQueryAgencias: () => ({
    queryAgencias: {
      data: [{ id: 1, name: "Central", code: "CEN" }],
      isLoading: false,
      isError: false,
    },
  }),
}));

vi.mock("@/hooks/roles/useQueryRoles", () => ({
  useQueryRoles: () => ({
    queryRoles: {
      data: [{ id: 7, role: "Analista", state: true }],
      isLoading: false,
      isError: false,
    },
  }),
}));

vi.mock("@/hooks/movements/useMutationMovements", () => ({
  useMutationCreateMovements: () => ({
    mutation: mutationState,
    isLoading: mutationState.isPending,
  }),
}));

vi.mock("@/hooks/colaboradores/useInfiniteColaboradores", () => ({
  useInfiniteColaboradores: () => ({
    data: {
      pages: [
        {
          results: [],
          next: null,
        },
      ],
    },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useInfoUserQuery: () => useInfoUserQueryMock(),
  useHasPermission: () => ({
    hasPermission: true,
  }),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/mi-acceso"]}>
      <MiAccesoPage />
    </MemoryRouter>,
  );
}

describe("MiAccesoPage", () => {
  beforeEach(() => {
    mutationState.mutateAsync.mockReset();
    mutationState.isPending = false;
    toast.success.mockReset();
    toast.error.mockReset();
    toast.info.mockReset();
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });
  });

  it("renderiza el encabezado y los movimientos iniciales", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: /mi acceso/i })).toBeInTheDocument();
    expect(
      screen.getByText("Registra altas, bajas, movimientos y rotaciones. Todos los cambios se aplicarán en la fecha efectiva indicada."),
    ).toBeInTheDocument();
    expect(screen.getByText("Movimientos pendientes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirmar 0 movimientos/i })).toBeInTheDocument();
    expect(screen.getByText("No hay movimientos registrados")).toBeInTheDocument();
  });

  it("muestra errores nuevos de alta cuando faltan campos requeridos", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /Añadir movimiento/i }));
    await user.click(screen.getByRole("menuitem", { name: "Alta" }));
    await user.click(screen.getByRole("button", { name: /Confirmar 1 movimiento/i }));

    expect(screen.getByText("El ID de empleado es requerido.")).toBeInTheDocument();
    expect(screen.getByText("El username es requerido.")).toBeInTheDocument();
    expect(screen.getByText("El correo es requerido.")).toBeInTheDocument();
    expect(screen.getByText("La contraseña es requerida.")).toBeInTheDocument();
    expect(screen.getByText("La confirmación de contraseña es requerida.")).toBeInTheDocument();
    expect(mutationState.mutateAsync).not.toHaveBeenCalled();
  });

  it("envía el lote al confirmar una alta válida y limpia la captura", async () => {
    const user = userEvent.setup();
    mutationState.mutateAsync.mockResolvedValueOnce({ ok: true });

    renderPage();

    await user.click(screen.getByRole("button", { name: /Añadir movimiento/i }));
    await user.click(screen.getByRole("menuitem", { name: "Alta" }));

    await user.type(screen.getByLabelText("Nombre completo *"), "Juan Pablo Perez");
    await user.type(screen.getByLabelText("DPI *"), "1234567890123");
    await user.type(screen.getByLabelText("ID de empleado *"), "4567");
    expect(screen.getByLabelText("Username *")).toHaveValue("mcjpperez");
    expect(screen.getByLabelText("Correo electrónico *")).toHaveValue("jpperez@acredicom.com.gt");
    await user.type(screen.getByLabelText("Contraseña *"), "PasswordSegura123!");
    await user.type(screen.getByLabelText("Confirmar contraseña *"), "PasswordSegura123!");

    const comboboxes = screen.getAllByRole("combobox");
    await user.click(comboboxes[0]);
    await user.click(screen.getByText("Central"));
    await user.click(comboboxes[1]);
    await user.click(screen.getByText("Analista"));

    await user.click(screen.getByRole("button", { name: /Confirmar 1 movimiento/i }));

    await waitFor(() => {
      expect(mutationState.mutateAsync).toHaveBeenCalledWith([
        {
          tipo: "alta",
          fecha: expect.any(String),
          colaborador: {
            nombre: "Juan Pablo Perez",
            username: "mcjpperez",
            email: "jpperez@acredicom.com.gt",
            password: "PasswordSegura123!",
            dpi: "1234567890123",
            cif: "4567",
            agency_id: 1,
            role_id: 7,
          },
        },
      ]);
    });

    await waitFor(() => {
      expect(screen.getByText("No hay movimientos registrados")).toBeInTheDocument();
    });
  });

  it("deshabilita el botón mientras la mutation está pendiente", () => {
    mutationState.isPending = true;

    renderPage();

    expect(screen.getByRole("button", { name: /Confirmando/i })).toBeDisabled();
  });

  it("deshabilita agencia y puesto cuando faltan esos permisos", async () => {
    const user = userEvent.setup();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: ["acceso_movimientos", "listar_usuarios_oauth"],
      },
    });

    renderPage();

    await user.click(screen.getByRole("button", { name: /Añadir movimiento/i }));
    await user.click(screen.getByRole("menuitem", { name: "Movimiento" }));

    expect(screen.getByRole("combobox", { name: /Asignar agencia/i })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: /Puesto/i })).toBeDisabled();
    expect(screen.getByText("Sin permiso para listar agencias")).toBeInTheDocument();
    expect(screen.getByText("Sin permiso para listar puestos")).toBeInTheDocument();
  });
});
