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

const mockMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
};

const renderNavMenu = (initialEntries: string[] = ["/"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <SidebarProvider>
        <NavMenu items={dataRoutes.navMain} label="Menu" />
      </SidebarProvider>
    </MemoryRouter>,
  );

const getGroupTrigger = (label: string) => screen.getByText(label).closest("button");

describe("NavMenu permissions", () => {
  it("mantiene visibles los módulos admin para staff aunque falten oauth_perms", async () => {
    const user = userEvent.setup();
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    renderNavMenu();

    await user.click(screen.getByText("Talento Humano"));

    expect(screen.getByText("Movimientos")).toBeInTheDocument();
    expect(screen.getByText("Reporteria")).toBeInTheDocument();
    expect(getGroupTrigger("Talento Humano")).toHaveAttribute("aria-expanded", "true");
  });

  it("muestra módulos permitidos a usuarios no staff cuando sí tienen oauth_perms", async () => {
    const user = userEvent.setup();
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: ["acceso_movimientos", "acceso_reporteria_movimientos"],
      },
    });

    renderNavMenu();

    await user.click(screen.getByText("Talento Humano"));

    expect(screen.getByText("Movimientos")).toBeInTheDocument();
    expect(screen.getByText("Reporteria")).toBeInTheDocument();
    expect(screen.queryByText("Auditoria")).not.toBeInTheDocument();
    expect(screen.queryByText("Colaboradores")).not.toBeInTheDocument();
    expect(screen.queryByText("Unidades de trabajo")).not.toBeInTheDocument();
    expect(screen.queryByText("Puestos")).not.toBeInTheDocument();
  });

  it("muestra Auditoria como módulo raíz cuando el usuario tiene el permiso", () => {
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: ["consultar_log_auditoria"],
      },
    });

    renderNavMenu(["/auditoria"]);

    expect(screen.getByText("Auditoria")).toBeInTheDocument();
  });

  it("oculta Mi acceso cuando el usuario no tiene ninguno de sus permisos", () => {
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [],
      },
    });

    renderNavMenu(["/profile"]);

    expect(screen.queryByText("Mi acceso")).not.toBeInTheDocument();
  });

  it("muestra solo Mis solicitudes cuando el usuario tiene acceso_mis_solicitudes", async () => {
    const user = userEvent.setup();
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: ["acceso_mis_solicitudes"],
      },
    });

    renderNavMenu(["/mi-acceso"]);

    await user.click(screen.getByText("Mi acceso"));

    expect(screen.getByText("Mis solicitudes")).toBeInTheDocument();
    expect(screen.queryByText("Administracion solicitudes")).not.toBeInTheDocument();
  });

  it("muestra solo Administracion solicitudes cuando el usuario tiene administrar_solicitudes", async () => {
    const user = userEvent.setup();
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: ["administrar_solicitudes"],
      },
    });

    renderNavMenu(["/mi-acceso/administracion-solicitudes"]);

    await user.click(screen.getByText("Mi acceso"));

    expect(screen.queryByText("Mis solicitudes")).not.toBeInTheDocument();
    expect(screen.getByText("Administracion solicitudes")).toBeInTheDocument();
  });

  it("mantiene abierto Talento Humano cuando la ruta activa pertenece a uno de sus subitems", () => {
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    renderNavMenu(["/movimientos"]);

    expect(screen.getByText("Movimientos")).toBeInTheDocument();
    expect(screen.getByText("Reporteria")).toBeInTheDocument();
    expect(getGroupTrigger("Talento Humano")).toHaveAttribute("aria-expanded", "true");
  });

  it("mantiene abierto el grupo después de navegar hacia un subitem activo", async () => {
    const user = userEvent.setup();
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    renderNavMenu();

    await user.click(screen.getByText("Talento Humano"));
    await user.click(screen.getByText("Movimientos"));

    expect(screen.getByText("Movimientos")).toBeInTheDocument();
    expect(screen.getByText("Reporteria")).toBeInTheDocument();
    expect(getGroupTrigger("Talento Humano")).toHaveAttribute("aria-expanded", "true");
  });

  it("expande Mi acceso y muestra sus subitems", async () => {
    const user = userEvent.setup();
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    renderNavMenu();

    await user.click(screen.getByText("Mi acceso"));

    expect(screen.getByText("Mis solicitudes")).toBeInTheDocument();
    expect(screen.getByText("Administracion solicitudes")).toBeInTheDocument();
    expect(getGroupTrigger("Mi acceso")).toHaveAttribute("aria-expanded", "true");
  });

  it("mantiene abierto Mi acceso cuando la ruta activa es /mi-acceso", () => {
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    renderNavMenu(["/mi-acceso"]);

    expect(screen.getByText("Mis solicitudes")).toBeInTheDocument();
    expect(screen.getByText("Administracion solicitudes")).toBeInTheDocument();
    expect(getGroupTrigger("Mi acceso")).toHaveAttribute("aria-expanded", "true");
  });

  it("mantiene abierto Mi acceso cuando la ruta activa es /mi-acceso/administracion-solicitudes", () => {
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    renderNavMenu(["/mi-acceso/administracion-solicitudes"]);

    expect(screen.getByText("Mis solicitudes")).toBeInTheDocument();
    expect(screen.getByText("Administracion solicitudes")).toBeInTheDocument();
    expect(getGroupTrigger("Mi acceso")).toHaveAttribute("aria-expanded", "true");
  });

  it("mantiene abierto otro grupo colapsable cuando una ruta hija está activa", () => {
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    renderNavMenu(["/agencias"]);

    expect(screen.getByText("Gestionar agencias")).toBeInTheDocument();
    expect(screen.getByText("Gestionar áreas")).toBeInTheDocument();
    expect(getGroupTrigger("Unidades de trabajo")).toHaveAttribute("aria-expanded", "true");
  });

  it("muestra Puestos como subitem de Unidades de trabajo para usuarios staff", async () => {
    const user = userEvent.setup();
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: true,
        oauth_perms: [],
      },
    });

    renderNavMenu(["/puestos"]);

    await user.click(screen.getByText("Unidades de trabajo"));

    expect(screen.getByText("Puestos")).toBeInTheDocument();
    expect(getGroupTrigger("Unidades de trabajo")).toHaveAttribute("aria-expanded", "true");
  });

  it("muestra Puestos a un usuario no staff cuando tiene ver_puesto", async () => {
    const user = userEvent.setup();
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: ["ver_puesto"],
      },
    });

    renderNavMenu(["/puestos"]);

    await user.click(screen.getByText("Unidades de trabajo"));

    expect(screen.getByText("Puestos")).toBeInTheDocument();
  });

  it("oculta Puestos a un usuario no staff cuando falta ver_puesto", async () => {
    mockMatchMedia();

    useInfoUserQueryMock.mockReturnValue({
      data: {
        is_staff: false,
        oauth_perms: [],
      },
    });

    renderNavMenu(["/agencias"]);

    expect(screen.queryByText("Unidades de trabajo")).not.toBeInTheDocument();
    expect(screen.queryByText("Puestos")).not.toBeInTheDocument();
  });
});
