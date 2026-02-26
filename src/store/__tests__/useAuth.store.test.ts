import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../useAuth.store";

vi.mock("zustand/middleware", async () => {
  const actual = await vi.importActual<typeof import("zustand/middleware")>("zustand/middleware");
  return {
    ...actual,
    persist: ((stateCreator: unknown) =>
      stateCreator as typeof import("zustand").StateCreator<unknown>) as typeof actual.persist,
  };
});

// Mock de los servicios
vi.mock("@/services/auth/auth.services", () => ({
  login: vi.fn(),
  logout: vi.fn(),
}));

// Mock de queryClient
vi.mock("@/lib/react-query", () => ({
  queryClient: {
    removeQueries: vi.fn(),
    clear: vi.fn(),
  },
}));

// Mock de toast
vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn((promise, options) => {
      return promise.then(
        (result: unknown) => {
          options?.success?.(result);
          return result;
        },
        (error: unknown) => {
          options?.error?.(error);
          throw error;
        },
      );
    }),
  },
}));

// Mock de logger
vi.mock("@/lib/logger", () => ({
  logger: {
    errorWithContext: vi.fn(),
  },
}));

describe("useAuthStore", () => {
  beforeEach(async () => {
    // Resetear el store antes de cada test
    vi.clearAllMocks();
    await act(async () => {
      useAuthStore.getState().logout();
    });
  });

  afterEach(async () => {
    // Limpiar el store después de cada test
    await act(async () => {
      useAuthStore.getState().logout();
    });
  });

  describe("login", () => {
    it("debe establecer tokens y autenticación después de login exitoso", async () => {
      const { login: loginService } = await import("@/services/auth/auth.services");
      (loginService as ReturnType<typeof vi.fn>).mockResolvedValue({
        access: "access-token",
        refresh: "refresh-token",
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({
          username: "testuser",
          password: "testpass",
        });
      });

      expect(result.current.access).toBe("access-token");
      expect(result.current.refresh).toBe("refresh-token");
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("debe manejar errores de login", async () => {
      const { login: loginService } = await import("@/services/auth/auth.services");
      const mockError = { error: "Invalid credentials" };
      (loginService as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { data: mockError },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login({
            username: "testuser",
            password: "wrongpass",
          });
        } catch {
          // Error esperado
        }
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("logout", () => {
    it("debe limpiar el estado de autenticación", async () => {
      const { login: loginService } = await import("@/services/auth/auth.services");
      const { logout: logoutService } = await import("@/services/auth/auth.services");
      const { queryClient } = await import("@/lib/react-query");

      // Primero hacer login
      (loginService as ReturnType<typeof vi.fn>).mockResolvedValue({
        access: "access-token",
        refresh: "refresh-token",
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({
          username: "testuser",
          password: "testpass",
        });
      });

      // Luego hacer logout
      (logoutService as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.access).toBeNull();
      expect(result.current.refresh).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(queryClient.clear).toHaveBeenCalled();
    });
  });

  describe("setAccessToken", () => {
    it("debe actualizar el access token", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setAccessToken("new-access-token");
      });

      expect(result.current.access).toBe("new-access-token");
    });
  });
});
