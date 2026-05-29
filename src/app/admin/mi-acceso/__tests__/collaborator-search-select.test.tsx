import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";

import { CollaboratorSearchSelect } from "../collaborator-search-select";

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
    areas: [],
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
    areas: [],
    is_active: false,
    is_staff: false,
    is_superuser: false,
    picture: null,
    email: "luis@example.com",
  },
];

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

vi.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: false,
  }),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useHasPermission: () => ({
    hasPermission: true,
  }),
}));

describe("CollaboratorSearchSelect", () => {
  it("muestra solo colaboradores activos en la búsqueda", async () => {
    const user = userEvent.setup();

    render(
      <CollaboratorSearchSelect
        value={null}
        onChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.queryByText("Luis Gómez")).not.toBeInTheDocument();
  });

  it("mantiene visible un colaborador inactivo ya seleccionado con estilo atenuado", () => {
    render(
      <CollaboratorSearchSelect
        value={{
          id: 13,
          name: "Luis Gómez",
          agency: "Norte",
          position: "Supervisor",
          isActive: false,
        }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Luis Gómez")).toHaveClass("text-muted-foreground");
  });
});
