import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileInfo } from "../profile-info";

const { invalidateQueriesMock, mutateMock, useMutationMock, useQueryMock } = vi.hoisted(() => ({
  invalidateQueriesMock: vi.fn(),
  mutateMock: vi.fn(),
  useMutationMock: vi.fn(),
  useQueryMock: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();

  return {
    ...actual,
    useQuery: () => useQueryMock(),
    useMutation: (options: unknown) => useMutationMock(options),
    useQueryClient: () => ({
      invalidateQueries: invalidateQueriesMock,
    }),
  };
});

function renderComponent() {
  return render(
    <MemoryRouter>
      <ProfileInfo />
    </MemoryRouter>,
  );
}

describe("ProfileInfo", () => {
  beforeEach(() => {
    invalidateQueriesMock.mockReset();
    mutateMock.mockReset();
    useMutationMock.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
  });

  it("renderiza el acceso rápido a Mi acceso junto a los badges de MFA y Staff", () => {
    useQueryMock.mockReturnValue({
      data: {
        name: "Danilo Calderon",
        username: "mcalderon",
        otp_enabled: false,
        is_staff: true,
        agency: { name: "Corporativo" },
        role: { role: "Programador Frontend" },
        area: { name: "Sistemas" },
        email: "danilo@example.com",
        dpi: "1234567890123",
        cif: "2171026",
        picture: null,
      },
      isLoading: false,
    });

    renderComponent();

    expect(screen.getByText("MFA inactivo")).toBeInTheDocument();
    expect(screen.getByText("Staff")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mi acceso/i })).toHaveAttribute("href", "/mi-acceso");
  });

  it("mantiene visible el CTA de Mi acceso aunque el usuario no sea staff", () => {
    useQueryMock.mockReturnValue({
      data: {
        name: "Ana Perez",
        username: "aperez",
        otp_enabled: true,
        is_staff: false,
        agency: { name: "Central" },
        role: { role: "Analista" },
        area: { name: "Operaciones" },
        email: "ana@example.com",
        dpi: "9876543210123",
        cif: "998877",
        picture: null,
      },
      isLoading: false,
    });

    renderComponent();

    expect(screen.getByText("MFA activo")).toBeInTheDocument();
    expect(screen.queryByText("Staff")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mi acceso/i })).toBeInTheDocument();
  });
});
