import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Result as CollaboratorResult } from "@/interfaces/colaboradores.interfaces";

import { RecipientMultiSelect } from "../recipient-multi-select";

const activeRecipient: CollaboratorResult = {
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
};

const inactiveRecipient: CollaboratorResult = {
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
};

vi.mock("@/hooks/colaboradores/useInfiniteColaboradores", () => ({
  useInfiniteColaboradores: () => ({
    data: { pages: [{ results: [activeRecipient, inactiveRecipient] }] },
    isLoading: false,
    isError: false,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useHasPermission: () => ({
    hasPermission: true,
  }),
}));

describe("RecipientMultiSelect", () => {
  it("ofrece solo colaboradores activos como nuevas opciones", async () => {
    const user = userEvent.setup();

    render(<RecipientMultiSelect selectedRecipients={[]} onChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox", { name: /Seleccionar colaboradores destinatarios/i }));

    expect(screen.getByRole("option", { name: /Ana Pérez/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Luis Gómez/i })).not.toBeInTheDocument();
  });

  it("mantiene atenuado un destinatario inactivo ya seleccionado", () => {
    render(<RecipientMultiSelect selectedRecipients={[inactiveRecipient]} onChange={vi.fn()} />);

    expect(screen.getByText("Luis Gómez").closest('[data-slot="combobox-chip"]')).toHaveClass("opacity-60");
  });
});
