import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { GruposSeleccionados } from "../grupos-seleccionados";

const { toastSuccessMock } = vi.hoisted(() => ({
  toastSuccessMock: vi.fn(),
}));

vi.mock("@/hooks/grupos/useQueryGrupos", () => ({
  useQueryGruposSinPaginacion: () => ({
    queryGruposSinPaginacion: {
      data: [
        {
          id: 1,
          nombre: "Grupo 1",
          aplicativos: [{ id: 1, nombre: "App A" }],
          permisos: [],
          users: [],
          users_count: 0,
          state: true,
        },
        {
          id: 2,
          nombre: "Grupo 2",
          aplicativos: [{ id: 1, nombre: "App A" }],
          permisos: [],
          users: [],
          users_count: 0,
          state: true,
        },
        {
          id: 3,
          nombre: "Grupo 3",
          aplicativos: [{ id: 2, nombre: "App B" }],
          permisos: [],
          users: [],
          users_count: 0,
          state: true,
        },
      ] satisfies GruposTypeModel[],
      isLoading: false,
    },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: vi.fn(),
  },
}));

function Harness({
  groupIds,
  fallbackGroups = [],
  collaboratorKey,
}: {
  groupIds: number[];
  fallbackGroups?: GruposTypeModel[];
  collaboratorKey?: number | string;
}) {
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>([]);

  return (
    <GruposSeleccionados
      selectedGroups={selectedGroups}
      setSelectedGroups={setSelectedGroups}
      groupIds={groupIds}
      fallbackGroups={fallbackGroups}
      collaboratorKey={collaboratorKey}
    />
  );
}

describe("GruposSeleccionados", () => {
  beforeEach(() => {
    toastSuccessMock.mockReset();
  });

  it("resincroniza la selección cuando cambia la fuente de groupIds aunque el usuario ya haya modificado grupos", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness groupIds={[1]} />);

    await waitFor(() => {
      expect(screen.getByText("Grupo 1")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Grupo 2"));

    await waitFor(() => {
      expect(screen.getByText("Grupo 2")).toBeInTheDocument();
    });

    rerender(<Harness groupIds={[3]} />);

    await waitFor(() => {
      expect(screen.getByText("Grupo 3")).toBeInTheDocument();
      expect(screen.queryByText("Grupo 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Grupo 2")).not.toBeInTheDocument();
    });
  });

  it("usa fallbackGroups cuando el catálogo global no trae los IDs del colaborador", async () => {
    render(
      <Harness
        collaboratorKey={2}
        groupIds={[99]}
        fallbackGroups={[
          {
            id: 99,
            nombre: "Grupo fallback",
            aplicativos: [],
            permisos: [],
            users: [],
            users_count: 0,
            state: true,
          },
        ]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Grupo fallback")).toBeInTheDocument();
      expect(screen.getByText("Sin aplicativo")).toBeInTheDocument();
    });
  });

  it("limpia la selección al cambiar a un colaborador sin grupos", async () => {
    const { rerender } = render(<Harness collaboratorKey={1} groupIds={[1, 2]} />);

    await waitFor(() => {
      expect(screen.getByText("Grupo 1")).toBeInTheDocument();
      expect(screen.getByText("Grupo 2")).toBeInTheDocument();
    });

    rerender(<Harness collaboratorKey={3} groupIds={[]} />);

    await waitFor(() => {
      expect(screen.getByText("No hay grupos seleccionados")).toBeInTheDocument();
      expect(screen.queryByText("Grupo 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Grupo 2")).not.toBeInTheDocument();
    });
  });

  it("preserva cambios manuales mientras siga siendo el mismo colaborador", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness collaboratorKey={1} groupIds={[1]} />);

    await waitFor(() => {
      expect(screen.getByText("Grupo 1")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("Grupo 2"));

    await waitFor(() => {
      expect(screen.getByText("Grupo 2")).toBeInTheDocument();
    });

    rerender(<Harness collaboratorKey={1} groupIds={[1]} />);

    await waitFor(() => {
      expect(screen.getByText("Grupo 1")).toBeInTheDocument();
      expect(screen.getByText("Grupo 2")).toBeInTheDocument();
    });
  });
});
