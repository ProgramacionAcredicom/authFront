import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { PermissionRoute } from "../PermissionRoute";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";
import { useAuthStore } from "@/store/useAuth.store";
import { useInfoUserQuery } from "@/hooks/auth/usePermissionAccess";

vi.mock("@/store/useAuth.store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/hooks/auth/usePermissionAccess", () => ({
  useInfoUserQuery: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">Navigate to: {to}</div>,
    Outlet: () => <div data-testid="outlet">Protected Content</div>,
  };
});

const renderWithRouter = (component: React.ReactElement) => render(<BrowserRouter>{component}</BrowserRouter>);

describe("PermissionRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("permite el acceso a staff aunque falte el oauth_perm", () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (useInfoUserQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { is_staff: true, oauth_perms: [] },
      isLoading: false,
    });

    renderWithRouter(<PermissionRoute requiredPermission={OAUTH_PERMISSIONS.MOVEMENTS_REPORT_ACCESS} />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("redirige a /profile cuando no es staff y no tiene el permiso", () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (useInfoUserQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { is_staff: false, oauth_perms: [] },
      isLoading: false,
    });

    renderWithRouter(<PermissionRoute requiredPermission={OAUTH_PERMISSIONS.MOVEMENTS_REPORT_ACCESS} />);

    expect(screen.getByTestId("navigate")).toHaveTextContent("Navigate to: /profile");
  });

  it("permite el acceso a un usuario no staff cuando sí tiene el permiso", () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (useInfoUserQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { is_staff: false, oauth_perms: [OAUTH_PERMISSIONS.MOVEMENTS_REPORT_ACCESS] },
      isLoading: false,
    });

    renderWithRouter(<PermissionRoute requiredPermission={OAUTH_PERMISSIONS.MOVEMENTS_REPORT_ACCESS} />);

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });
});
