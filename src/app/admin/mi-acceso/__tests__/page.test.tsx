import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import MiAccesoPage from "../page";

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/mi-acceso"]}>
        <MiAccesoPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("MiAccesoPage", () => {
  it("renderiza el encabezado y los movimientos iniciales", () => {
    renderPage();

    expect(screen.getByText("Mi Acceso")).toBeInTheDocument();
    expect(
      screen.getByText("Registra altas, bajas, movimientos y rotaciones. Todos los cambios se aplicarán en la fecha efectiva indicada."),
    ).toBeInTheDocument();
    expect(screen.getByText("Movimientos pendientes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirmar 0 movimientos/i })).toBeInTheDocument();
    expect(screen.getByText("No hay movimientos registrados")).toBeInTheDocument();
  });

  it("permite agregar y eliminar movimientos en el estado local", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /Añadir movimiento/i }));
    await user.click(screen.getByRole("menuitem", { name: "Alta" }));

    expect(screen.getAllByLabelText(/Descartar movimiento/i)).toHaveLength(1);

    while (screen.queryAllByLabelText(/Descartar movimiento/i).length > 0) {
      const discardButtons = screen.getAllByLabelText(/Descartar movimiento/i);
      await user.click(discardButtons[0]);
    }

    expect(screen.getByText("No hay movimientos registrados")).toBeInTheDocument();
  });

  it("muestra errores cuando se intenta confirmar con campos requeridos vacíos", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("button", { name: /Añadir movimiento/i }));
    await user.click(screen.getByRole("menuitem", { name: "Alta" }));
    await user.click(screen.getByRole("button", { name: /Confirmar 1 movimiento/i }));

    expect(screen.getByText("El nombre completo es requerido.")).toBeInTheDocument();
    expect(screen.getByText("El DPI es requerido.")).toBeInTheDocument();
    expect(screen.getByText("La agencia es requerida.")).toBeInTheDocument();
  });
});
