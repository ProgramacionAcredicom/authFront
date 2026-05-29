import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { NavMenu } from "../nav-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { dataRoutes } from "@/routes/data-routes";

const { useInfoUserQueryMock } = vi.hoisted(() => ({
  useInfoUserQueryMock: vi.fn(),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useInfoUserQuery: () => useInfoUserQueryMock(),
}));

describe("NavMenu permissions", () => {
  it("mantiene visibles los módulos admin para staff aunque falten oauth_perms", async () => {
    const user = userEvent.setup();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    render(
      <MemoryRouter>
        <SidebarProvider>
          <NavMenu items={dataRoutes.navMain} label="Menu" />
        </SidebarProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Talento Humano"));

    expect(screen.getByText("Movimientos")).toBeInTheDocument();
    expect(screen.getByText("Reporteria")).toBeInTheDocument();
  });

  it("muestra módulos permitidos a usuarios no staff cuando sí tienen oauth_perms", async () => {
    const user = userEvent.setup();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: ["acceso_movimientos", "acceso_reporteria_movimientos"],
      },
    });

    render(
      <MemoryRouter>
        <SidebarProvider>
          <NavMenu items={dataRoutes.navMain} label="Menu" />
        </SidebarProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Talento Humano"));

    expect(screen.getByText("Movimientos")).toBeInTheDocument();
    expect(screen.getByText("Reporteria")).toBeInTheDocument();
    expect(screen.queryByText("Colaboradores")).not.toBeInTheDocument();
    expect(screen.queryByText("Unidades de trabajo")).not.toBeInTheDocument();
  });
});
