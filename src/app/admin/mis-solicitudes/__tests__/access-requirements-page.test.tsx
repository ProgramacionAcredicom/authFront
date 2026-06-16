import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OAUTH_PERMISSIONS } from "@/lib/permissions";
import AccessRequirementsPage from "../access-requirements-page";

const {
  useQueryMock,
  mutateAsyncCreateMock,
  mutateAsyncDownloadMock,
  useQueryAccessSystemsMock,
} = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
  mutateAsyncCreateMock: vi.fn(),
  mutateAsyncDownloadMock: vi.fn(),
  useQueryAccessSystemsMock: vi.fn(),
}));

const { toast } = vi.hoisted(() => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast,
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");

  return {
    ...actual,
    useQuery: (...args: unknown[]) => useQueryMock(...args),
  };
});

vi.mock("@/hooks/mi-acceso/useQueryAccessSystems", () => ({
  useQueryAccessSystems: (...args: unknown[]) => useQueryAccessSystemsMock(...args),
}));

vi.mock("@/hooks/mi-acceso/useMutationCreateMiAccesoRequest", () => ({
  useMutationCreateMiAccesoRequest: () => ({
    mutateAsync: mutateAsyncCreateMock,
    isPending: false,
  }),
}));

vi.mock("@/hooks/mi-acceso/useMutationDownloadMiAccesoPdf", () => ({
  useMutationDownloadMiAccesoPdf: () => ({
    mutateAsync: mutateAsyncDownloadMock,
    isPending: false,
  }),
}));

vi.mock("@/app/admin/movimientos-registro/movement-date-picker", () => ({
  MovementDatePicker: ({
    id,
    value,
    onChange,
    ariaLabel,
    className,
  }: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    ariaLabel?: string;
    className?: string;
  }) => (
    <input
      id={id}
      aria-label={ariaLabel ?? id}
      className={className}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/mi-acceso/requerimiento-accesos"]}>
      <Routes>
        <Route path="/mi-acceso" element={<h1>Mis solicitudes</h1>} />
        <Route path="/mi-acceso/requerimiento-accesos" element={<AccessRequirementsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AccessRequirementsPage", () => {
  beforeEach(() => {
    useQueryMock.mockReset();
    mutateAsyncCreateMock.mockReset();
    mutateAsyncDownloadMock.mockReset();
    useQueryAccessSystemsMock.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();

    useQueryMock.mockReturnValue({
      data: {
        id: 24,
        cif: "EMP-2024-893",
        name: "Ramiro López",
        username: "rlopez",
        agency: { name: "Corporativo" },
        role: { role: "Analista Programador" },
        is_staff: false,
        oauth_perms: [OAUTH_PERMISSIONS.LIST_ACCESS_SYSTEMS],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    useQueryAccessSystemsMock.mockReturnValue({
      data: {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 501,
            code: "MOD-CRED",
            name: "Módulo de Créditos",
            description: "",
            is_active: true,
            system_kind: "form",
            created_at: "2026-06-01T09:00:00.000Z",
            updated_at: "2026-06-01T09:00:00.000Z",
          },
          {
            id: 502,
            code: "T24",
            name: "T24",
            description: "",
            is_active: true,
            system_kind: "form",
            created_at: "2026-06-01T09:00:00.000Z",
            updated_at: "2026-06-01T09:00:00.000Z",
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    mutateAsyncCreateMock.mockResolvedValue({ id: 901, code: "REQ-2026-901" });
    mutateAsyncDownloadMock.mockResolvedValue(undefined);
  });

  it("renderiza el solicitante actual y los tabs del flujo", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: /requerimiento accesos/i })).toBeInTheDocument();
    expect(screen.getByText(/^solicitante$/i)).toBeInTheDocument();
    expect(screen.getByText("Ramiro López")).toBeInTheDocument();
    expect(screen.getByText(/analista programador/i)).toBeInTheDocument();
    expect(screen.getByText(/usuario: rlopez/i)).toBeInTheDocument();
    expect(screen.getByText(/emp-2024-893/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /vacaciones \/ suspensión/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /nuevos permisos/i })).toBeInTheDocument();
  });

  it("envía el payload correcto para vacaciones sin descargar el PDF", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("combobox", { name: /tipo de vacaciones o suspensión/i }));
    await user.click(screen.getAllByText("Suspensión").at(-1)!);
    await user.type(screen.getByLabelText(/fecha inicio/i), "2026-06-10");
    await user.type(screen.getByLabelText(/fecha fin/i), "2026-06-12");
    await user.type(screen.getByLabelText(/motivo de solicitud/i), "Suspensión temporal por proceso interno.");
    await user.click(screen.getByRole("button", { name: /enviar requerimiento/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /mis solicitudes/i })).toBeInTheDocument();
    });

    expect(mutateAsyncCreateMock).toHaveBeenCalledWith({
      request_type: "vacaciones",
      subject_user_id: 24,
      additional_detail: "",
      absence_type: "suspension",
      start_date: "2026-06-10",
      end_date: "2026-06-12",
      reason: "Suspensión temporal por proceso interno.",
      systems: [],
    });
    expect(mutateAsyncDownloadMock).not.toHaveBeenCalled();
  });

  it("envía múltiples nuevos permisos y oculta sistemas ya seleccionados en otros registros", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("tab", { name: /nuevos permisos/i }));
    await user.click(screen.getByRole("button", { name: /agregar sistema/i }));

    const systemComboboxes = screen.getAllByRole("combobox", { name: /sistema para nuevo permiso/i });
    const observationFields = screen.getAllByLabelText(/observación de acceso/i);

    await user.click(systemComboboxes[0]);
    await user.click(screen.getAllByText("Módulo de Créditos").at(-1)!);
    await user.type(observationFields[0], "Necesita permisos de aprobación de alto rango.");

    await user.click(systemComboboxes[1]);
    expect(screen.queryByRole("option", { name: "Módulo de Créditos" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "T24" })).toBeInTheDocument();
    await user.click(screen.getAllByText("T24").at(-1)!);
    await user.type(observationFields[1], "Necesita acceso operativo complementario.");
    await user.click(screen.getByRole("button", { name: /enviar requerimiento/i }));

    await waitFor(() => {
      expect(mutateAsyncCreateMock).toHaveBeenCalled();
    });

    expect(useQueryAccessSystemsMock).toHaveBeenCalled();
    expect(mutateAsyncCreateMock).toHaveBeenCalledWith({
      request_type: "nuevo_permiso",
      subject_user_id: 24,
      additional_detail: "",
      systems: [
        {
          system_id: 501,
          reference_user_id: null,
          access_observation: "Necesita permisos de aprobación de alto rango.",
          sort_order: 0,
        },
        {
          system_id: 502,
          reference_user_id: null,
          access_observation: "Necesita acceso operativo complementario.",
          sort_order: 1,
        },
      ],
    });
    expect(mutateAsyncDownloadMock).not.toHaveBeenCalled();
  });

  it("reindexa el payload de nuevos permisos al eliminar una fila", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getByRole("tab", { name: /nuevos permisos/i }));
    await user.click(screen.getByRole("button", { name: /agregar sistema/i }));

    const initialComboboxes = screen.getAllByRole("combobox", { name: /sistema para nuevo permiso/i });
    const initialObservationFields = screen.getAllByLabelText(/observación de acceso/i);

    await user.click(initialComboboxes[0]);
    await user.click(screen.getAllByText("Módulo de Créditos").at(-1)!);
    await user.type(initialObservationFields[0], "Permiso temporal para validaciones.");

    await user.click(initialComboboxes[1]);
    await user.click(screen.getAllByText("T24").at(-1)!);
    await user.type(initialObservationFields[1], "Permiso definitivo para operación.");

    await user.click(screen.getByRole("button", { name: /eliminar sistema 1/i }));
    await user.click(screen.getByRole("button", { name: /enviar requerimiento/i }));

    await waitFor(() => {
      expect(mutateAsyncCreateMock).toHaveBeenCalled();
    });

    expect(mutateAsyncCreateMock).toHaveBeenCalledWith({
      request_type: "nuevo_permiso",
      subject_user_id: 24,
      additional_detail: "",
      systems: [
        {
          system_id: 502,
          reference_user_id: null,
          access_observation: "Permiso definitivo para operación.",
          sort_order: 0,
        },
      ],
    });
    expect(mutateAsyncDownloadMock).not.toHaveBeenCalled();
  });

  it("muestra error si falla la carga de sistemas en el tab de nuevos permisos", async () => {
    const user = userEvent.setup();

    useQueryAccessSystemsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("boom"),
    });

    renderPage();

    await user.click(screen.getByRole("tab", { name: /nuevos permisos/i }));

    expect(screen.getByText(/no se pudieron cargar los sistemas/i)).toBeInTheDocument();
  });

  it("muestra estado informativo si falta listar_sistemas_acceso en nuevos permisos", async () => {
    const user = userEvent.setup();

    useQueryMock.mockReturnValue({
      data: {
        id: 24,
        cif: "EMP-2024-893",
        name: "Ramiro López",
        username: "rlopez",
        agency: { name: "Corporativo" },
        role: { role: "Analista Programador" },
        is_staff: false,
        oauth_perms: [],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    await user.click(screen.getByRole("tab", { name: /nuevos permisos/i }));

    expect(screen.getByText("Sin permisos para listar sistemas")).toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: /sistema para nuevo permiso/i })).not.toBeInTheDocument();
    expect(useQueryAccessSystemsMock).toHaveBeenCalledWith(
      { is_active: true, system_kind: "form" },
      { enabled: false },
    );
  });

  it("vuelve al listado después de crear la solicitud sin descargar PDF", async () => {
    const user = userEvent.setup();

    renderPage();

    await user.type(screen.getByLabelText(/fecha inicio/i), "2026-06-10");
    await user.type(screen.getByLabelText(/fecha fin/i), "2026-06-12");
    await user.type(screen.getByLabelText(/motivo de solicitud/i), "Bloqueo por vacaciones programadas.");
    await user.click(screen.getByRole("button", { name: /enviar requerimiento/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /mis solicitudes/i })).toBeInTheDocument();
    });

    expect(mutateAsyncCreateMock).toHaveBeenCalled();
    expect(mutateAsyncDownloadMock).not.toHaveBeenCalled();
  });
});
