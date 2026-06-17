import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TabPuestos from "../tab-puestos";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

const { useInfoUserQueryMock, useQueryPuestosMock } = vi.hoisted(() => ({
  useInfoUserQueryMock: vi.fn(),
  useQueryPuestosMock: vi.fn(),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useInfoUserQuery: () => useInfoUserQueryMock(),
}));

vi.mock("@/hooks/puestos/useQueryPuestos", () => ({
  useQueryPuestos: (...args: unknown[]) => useQueryPuestosMock(...args),
}));

vi.mock("@/components/modal/puestos/modal-agregar-puesto", () => ({
  ModalAgregarPuesto: () => <button type="button">Agregar</button>,
}));

vi.mock("@/components/modal/puestos/modal-editar-puesto", () => ({
  ModalEditarPuesto: () => <div data-testid="modal-editar-puesto" />,
}));

vi.mock("@/components/ui/cardPuesto", () => ({
  CardPuesto: ({ puesto }: { puesto: { role: string } }) => <div>{puesto.role}</div>,
}));

describe("TabPuestos permissions", () => {
  beforeEach(() => {
    useInfoUserQueryMock.mockReset();
    useQueryPuestosMock.mockReset();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [
          OAUTH_PERMISSIONS.VIEW_POSITION,
          OAUTH_PERMISSIONS.LIST_POSITIONS,
          OAUTH_PERMISSIONS.CREATE_POSITION,
          OAUTH_PERMISSIONS.UPDATE_POSITION,
          OAUTH_PERMISSIONS.DEACTIVATE_POSITION,
        ],
      },
      isLoading: false,
    });

    useQueryPuestosMock.mockReturnValue({
      queryPuestos: {
        data: [
          {
            id: 1,
            role: "Supervisor",
            state: true,
            gruposCount: 2,
            created_on: "2026-06-01T00:00:00.000Z",
          },
        ],
        isLoading: false,
      },
    });
  });

  it("muestra el botón Agregar cuando tiene crear_puesto", () => {
    render(<TabPuestos />);

    expect(screen.getByRole("button", { name: /agregar/i })).toBeInTheDocument();
    expect(screen.getByText("Supervisor")).toBeInTheDocument();
  });

  it("oculta el botón Agregar cuando falta crear_puesto", () => {
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [OAUTH_PERMISSIONS.VIEW_POSITION, OAUTH_PERMISSIONS.LIST_POSITIONS],
      },
      isLoading: false,
    });

    render(<TabPuestos />);

    expect(screen.queryByRole("button", { name: /agregar/i })).not.toBeInTheDocument();
  });

  it("muestra estado informativo y no lista cards cuando falta listar_puestos", () => {
    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [OAUTH_PERMISSIONS.VIEW_POSITION],
      },
      isLoading: false,
    });

    render(<TabPuestos />);

    expect(screen.getByText("Sin permisos para listar puestos")).toBeInTheDocument();
    expect(screen.queryByText("Supervisor")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/buscar por nombre del puesto/i)).not.toBeInTheDocument();
    expect(useQueryPuestosMock).toHaveBeenCalledWith(undefined, { enabled: false });
  });
});
