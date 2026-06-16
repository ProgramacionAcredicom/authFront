import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserType } from "@/interfaces/colaboradores.interfaces";
import { FormColaborador } from "../form-colaborador";

const { mutateAsyncMock, toastSuccessMock } = vi.hoisted(() => ({
  mutateAsyncMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: false,
  }),
}));

vi.mock("@/hooks/roles/useQueryRoles", () => ({
  useQueryRoles: () => ({
    queryRoles: {
      data: [{ id: 4, role: "Asistente de contabilidad", state: true }],
      isLoading: false,
    },
  }),
}));

vi.mock("@/hooks/areas/useQueryAreas", () => ({
  useQueryListAreasSinPaginacion: () => ({
    queryAreasSinPaginacion: {
      data: [{ id: 6, code: "CONT", name: "Contabilidad", chif: null, state: true }],
      isLoading: false,
    },
  }),
}));

vi.mock("@/hooks/agencias/useQueryAgencias", () => ({
  useQueryAgencias: () => ({
    queryAgencias: {
      data: [{ id: 26, code: "corp", name: "CORPORATIVO", chif: null, state: true, no_colaboradores: 0 }],
      isLoading: false,
    },
  }),
}));

vi.mock("@/hooks/colaboradores/useMutationColaboradores", () => ({
  useMutationUpdateColaborador: () => ({
    mutation: {
      mutateAsync: mutateAsyncMock,
    },
  }),
}));

vi.mock("@/services/auth/auth.services", () => ({
  generatePassword: vi.fn(),
}));

vi.mock("@/components/form/colaboradores/grupos-seleccionados", () => ({
  GruposSeleccionados: () => <div>Grupos seleccionados</div>,
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: vi.fn(),
  },
}));

describe("FormColaborador blocked state", () => {
  const user = {
    id: 2,
    dpi: "3094282891210",
    cif: "2077892",
    ejecutivo_principal: null,
    name: "Ervin Josue Salas Perez",
    username: "MCEJSALAS",
    email: "ejsalas@acredicom.com.gt",
    picture: "https://authdev.mcenlinea.com/media/user_photos/test.png",
    user_type: UserType.Usuario,
    agency: { id: 26, name: "CORPORATIVO", code: "corp", state: true },
    role: { id: 4, role: "ASISTENTE DE CONTABILIDAD", state: true },
    area: { id: 6, code: "CONT", name: "Contabilidad", chif: null, state: true },
    grupos: [{ id: 10, nombre: "Grupo base", permisos: [] }],
    is_active: true,
    is_blocked: false,
    is_staff: false,
    is_superuser: false,
    otp_enabled: false,
    executive_number: null,
  } as const;

  beforeEach(() => {
    mutateAsyncMock.mockReset();
    toastSuccessMock.mockReset();
    mutateAsyncMock.mockResolvedValue({ webhooks: [] });
  });

  function renderForm(initialBlocked = false) {
    const queryClient = new QueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FormColaborador
            selectedGroups={[{ id: 10, nombre: "Grupo base", permisos: [] } as any]}
            setSelectedGroups={vi.fn()}
            user={{ ...user, is_blocked: initialBlocked }}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  }

  function getBlockedChip(label: "Bloqueado" | "Desbloqueado") {
    return screen.getByText(label);
  }

  it("carga el chip correcto según is_blocked y cambia localmente al hacer click", async () => {
    const userEventSetup = userEvent.setup();

    renderForm(false);

    const unblockChip = getBlockedChip("Desbloqueado");
    expect(unblockChip).toBeInTheDocument();

    await userEventSetup.click(unblockChip);

    expect(getBlockedChip("Bloqueado")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("envía is_blocked actualizado al guardar", async () => {
    const userEventSetup = userEvent.setup();

    renderForm(false);

    await userEventSetup.click(getBlockedChip("Desbloqueado"));
    await userEventSetup.click(screen.getByRole("button", { name: /guardar/i }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalled();
    });

    const payload = mutateAsyncMock.mock.calls[0][0] as {
      id: number;
      data: FormData;
      config: { headers: { "Content-Type": string } };
    };

    expect(payload.id).toBe(2);
    expect(payload.data.get("is_blocked")).toBe("true");
  });
});
