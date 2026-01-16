import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { useAuthStore } from "@/store/useAuth.store";

// Mock del store
vi.mock("@/store/useAuth.store", () => ({
  useAuthStore: vi.fn(),
}));

// Mock de Navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">Navigate to: {to}</div>,
    Outlet: () => <div data-testid="outlet">Protected Content</div>,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe redirigir a /auth/login cuando el usuario no está autenticado", () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

    renderWithRouter(<ProtectedRoute />);

    const navigate = screen.getByTestId("navigate");
    expect(navigate).toBeInTheDocument();
    expect(navigate).toHaveTextContent("Navigate to: /auth/login");
  });

  it("debe mostrar el contenido protegido cuando el usuario está autenticado", () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    renderWithRouter(<ProtectedRoute />);

    const outlet = screen.getByTestId("outlet");
    expect(outlet).toBeInTheDocument();
    expect(outlet).toHaveTextContent("Protected Content");
  });
});

