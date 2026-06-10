import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CardPuesto } from "../cardPuesto";

const mutateMock = vi.fn();

vi.mock("@/hooks/puestos/useMutationPuestos", () => ({
  useMutationEliminarPuesto: () => ({
    mutationEliminarPuesto: {
      mutate: mutateMock,
    },
    isLoading: false,
  }),
}));

describe("CardPuesto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza nombre, estado y cantidad reportada por backend", () => {
    render(
      <CardPuesto
        puesto={{
          id: 3,
          role: "Supervisor regional",
          state: true,
          gruposCount: 8,
        }}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByText("Supervisor regional")).toBeInTheDocument();
    expect(screen.getByText("Activo")).toBeInTheDocument();
    expect(screen.getAllByText(/Total 8/)).toHaveLength(1);
    expect(screen.getByText("Cantidad reportada por backend")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("ejecuta la acción de editar desde la card", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <CardPuesto
        puesto={{
          id: 12,
          role: "Analista QA",
          state: true,
          gruposCount: 2,
        }}
        onEdit={onEdit}
      />,
    );

    await user.click(screen.getByRole("button", { name: /editar puesto/i }));

    expect(onEdit).toHaveBeenCalledWith(12);
  });

  it("confirma la desactivación y dispara la mutación", async () => {
    const user = userEvent.setup();

    render(
      <CardPuesto
        puesto={{
          id: 9,
          role: "Auditor",
          state: true,
          gruposCount: 4,
        }}
        onEdit={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /desactivar puesto auditor/i }));
    await user.click(screen.getByRole("button", { name: /^desactivar$/i }));

    expect(mutateMock).toHaveBeenCalledWith({ id: "9" });
  });
});
