import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserType } from "@/interfaces/colaboradores.interfaces";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { FormColaborador } from "../form-colaborador";
import { buildColaboradorFormData } from "../form-colaborador.utils";

const { createColaboradorMock, mutateAsyncMock, toastSuccessMock, useQueryPuestosMock } = vi.hoisted(() => ({
  createColaboradorMock: vi.fn(),
  mutateAsyncMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  useQueryPuestosMock: vi.fn(),
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
      data: [
        { id: 4, role: "Asistente de contabilidad", state: true },
        { id: 7, role: "Analista", state: true },
      ],
      isLoading: false,
    },
  }),
}));

vi.mock("@/hooks/puestos/useQueryPuestos", () => ({
  useQueryPuestos: (...args: unknown[]) => useQueryPuestosMock(...args),
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

vi.mock("@/services/colaboradores/colaboradores.services", () => ({
  createColaborador: (...args: unknown[]) => createColaboradorMock(...args),
}));

vi.mock("@/services/auth/auth.services", () => ({
  generatePassword: vi.fn(),
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: any }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: any }) => <>{children}</>,
  PopoverContent: ({ children }: { children: any }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/command", () => ({
  Command: ({ children }: { children: any }) => <div>{children}</div>,
  CommandList: ({ children }: { children: any }) => <div>{children}</div>,
  CommandGroup: ({ children }: { children: any }) => <div>{children}</div>,
  CommandEmpty: ({ children }: { children: any }) => <div>{children}</div>,
  CommandInput: ({ placeholder }: { placeholder?: string }) => <input placeholder={placeholder} />,
  CommandItem: ({
    children,
    onSelect,
    value,
  }: {
    children: any;
    onSelect?: (value: string) => void;
    value?: string;
  }) => (
    <button type="button" onClick={() => onSelect?.(value ?? "")}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/form/colaboradores/grupos-seleccionados", () => ({
  GruposSeleccionados: ({
    groupIds = [],
    fallbackGroups = [],
    selectedGroups,
    setSelectedGroups,
  }: {
    groupIds?: number[];
    fallbackGroups?: GruposTypeModel[];
    selectedGroups: GruposTypeModel[];
    setSelectedGroups: (groups: GruposTypeModel[]) => void;
  }) => (
    <div>
      <div data-testid="group-ids">{groupIds.join(",")}</div>
      <div data-testid="fallback-group-ids">{fallbackGroups.map((group) => group.id).join(",")}</div>
      <div data-testid="selected-group-ids">{selectedGroups.map((group) => group.id).join(",")}</div>
      <button
        type="button"
        onClick={() =>
          setSelectedGroups(
            groupIds.map((id) => ({
              id,
              nombre: `Grupo ${id}`,
              aplicativos: [],
              permisos: [],
              users: [],
              users_count: 0,
              state: true,
            })) as GruposTypeModel[],
          )
        }
      >
        Aplicar grupos precargados
      </button>
      <button
        type="button"
        onClick={() =>
          setSelectedGroups([
            {
              id: 999,
              nombre: "Grupo manual",
              aplicativos: [],
              permisos: [],
              users: [],
              users_count: 0,
              state: true,
            } as GruposTypeModel,
          ])
        }
      >
        Selección manual
      </button>
    </div>
  ),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: vi.fn(),
  },
}));

const baseUser = {
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

function TestHarness({ user }: { user?: typeof baseUser }) {
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>(
    user?.grupos?.map((group) => ({
      id: group.id,
      nombre: group.nombre,
      aplicativos: [],
      permisos: [],
      users: [],
      users_count: 0,
      state: true,
    })) ?? [],
  );

  return <FormColaborador selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} user={user} />;
}

function renderForm(user?: typeof baseUser) {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TestHarness user={user} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function selectCommandOption(user: ReturnType<typeof userEvent.setup>, triggerName: RegExp | string, optionText: string) {
  await user.click(screen.getByRole("combobox", { name: triggerName }));
  const options = await screen.findAllByRole("button", { name: optionText });
  await user.click(options[options.length - 1]);
}

describe("FormColaborador puesto/group preload", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
    createColaboradorMock.mockReset();
    toastSuccessMock.mockReset();
    useQueryPuestosMock.mockReset();

    mutateAsyncMock.mockResolvedValue({ webhooks: [] });
    createColaboradorMock.mockResolvedValue({ id: 123 });
    useQueryPuestosMock.mockImplementation((id?: string | number) => ({
      queryPuestos: { data: [], isLoading: false },
      queryPuestoById: {
        data:
          String(id) === "4"
            ? { id: 4, role: "Asistente de contabilidad", state: true, grupos: [10, 20] }
            : String(id) === "7"
              ? { id: 7, role: "Analista", state: true, grupos: [30] }
              : undefined,
        isLoading: false,
      },
    }));
  });

  it("precarga grupos del puesto en alta y los reemplaza al cambiar de puesto", async () => {
    const user = userEvent.setup();

    renderForm();

    expect(screen.getByTestId("group-ids")).toHaveTextContent("");

    await selectCommandOption(user, /puesto/i, "Asistente de contabilidad");
    await waitFor(() => {
      expect(screen.getByTestId("group-ids")).toHaveTextContent("10,20");
    });

    await selectCommandOption(user, /puesto/i, "Analista");
    await waitFor(() => {
      expect(screen.getByTestId("group-ids")).toHaveTextContent("30");
    });
  });

  it("en edición mantiene los grupos del colaborador y no aplica la precarga del puesto", () => {
    renderForm(baseUser);

    expect(screen.getByTestId("group-ids")).toHaveTextContent("10");
    expect(screen.getByTestId("fallback-group-ids")).toHaveTextContent("10");
  });

  it("construye FormData con exactamente los grupos editados manualmente", () => {
    const payload = buildColaboradorFormData({
      isEdit: false,
      hasModifiedGroups: true,
      selectedGroups: [
        {
          id: 20,
          nombre: "Grupo 20",
          aplicativos: [],
          permisos: [],
          users: [],
          users_count: 0,
          state: true,
        } as GruposTypeModel,
        {
          id: 999,
          nombre: "Grupo manual",
          aplicativos: [],
          permisos: [],
          users: [],
          users_count: 0,
          state: true,
        } as GruposTypeModel,
      ],
      data: {
        name: "Juan Carlos Perez",
        dpi: "1234567890123",
        cif: "12345",
        username: "mcjcperez",
        email: "jcperez@acredicom.com.gt",
        picture: null,
        agency: "26",
        role: "4",
        grup: [],
        user_type: UserType.Usuario,
        password: "Password123",
        confirm_password: "Password123",
        executive_number: null,
        is_active: true,
        is_blocked: false,
        is_staff: false,
        is_superuser: false,
        area: "",
      },
    });

    expect(payload.getAll("grup")).toEqual(["20", "999"]);
  });
});

describe("FormColaborador blocked state", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
    toastSuccessMock.mockReset();
    useQueryPuestosMock.mockReset();

    mutateAsyncMock.mockResolvedValue({ webhooks: [] });
    useQueryPuestosMock.mockImplementation(() => ({
      queryPuestos: { data: [], isLoading: false },
      queryPuestoById: { data: undefined, isLoading: false },
    }));
  });

  function getBlockedChip(label: "Bloqueado" | "Desbloqueado") {
    return screen.getByRole("button", { name: label });
  }

  it("carga el chip correcto según is_blocked y cambia localmente al hacer click", async () => {
    const user = userEvent.setup();

    renderForm({ ...baseUser, is_blocked: false });

    const unblockChip = getBlockedChip("Desbloqueado");
    expect(unblockChip).toBeInTheDocument();

    await user.click(unblockChip);

    expect(getBlockedChip("Bloqueado")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("envía is_blocked actualizado al guardar", async () => {
    const user = userEvent.setup();

    renderForm({ ...baseUser, is_blocked: false });

    await user.click(getBlockedChip("Desbloqueado"));
    await user.click(screen.getByRole("button", { name: /guardar/i }));

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
