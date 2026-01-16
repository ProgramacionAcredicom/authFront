import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { login, logout, refreshToken, getProfile } from "../auth.services";
import { env } from "@/config/env";

// Mock de axios
vi.mock("axios");
vi.mock("@/config/env", () => ({
  env: {
    VITE_HOST_AUTH_DEV: "https://api.test.com",
    VITE_APLICATIVO_ID: 1,
  },
}));

// Mock del mapper
vi.mock("@/mappers/local-perfilUsuario.mapper", () => ({
  localPerfilUsuarioMapper: (data: unknown) => data,
}));

// Mock de apiServices
vi.mock("../../configAxios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("Auth Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("debe hacer login correctamente con credenciales válidas", async () => {
      const mockResponse = {
        data: {
          access: "access-token",
          refresh: "refresh-token",
        },
      };

      (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await login({
        username: "testuser",
        password: "testpass",
      });

      expect(axios.post).toHaveBeenCalledWith(
        `${env.VITE_HOST_AUTH_DEV}/auth/login/`,
        {
          username: "testuser",
          password: "testpass",
          aplicativo_id: env.VITE_APLICATIVO_ID,
        },
      );

      expect(result).toEqual({
        access: "access-token",
        refresh: "refresh-token",
      });
    });

    it("debe propagar errores de login", async () => {
      const mockError = new Error("Invalid credentials");
      (axios.post as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

      await expect(
        login({
          username: "testuser",
          password: "wrongpass",
        }),
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("refreshToken", () => {
    it("debe refrescar el token correctamente", async () => {
      const apiServices = await import("../../configAxios");
      const mockResponse = {
        data: {
          access: "new-access-token",
        },
      };

      (apiServices.default.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await refreshToken({ refresh: "refresh-token" });

      expect(apiServices.default.post).toHaveBeenCalledWith(
        `${env.VITE_HOST_AUTH_DEV}/auth/token/refresh/`,
        { refresh: "refresh-token" },
      );

      expect(result).toEqual({
        access: "new-access-token",
      });
    });
  });

  describe("getProfile", () => {
    it("debe obtener el perfil del usuario", async () => {
      const apiServices = await import("../../configAxios");
      const mockResponse = {
        data: {
          id: 1,
          username: "testuser",
          email: "test@example.com",
        },
      };

      (apiServices.default.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await getProfile();

      expect(apiServices.default.post).toHaveBeenCalledWith("/auth/info/", {
        aplicativo_id: env.VITE_APLICATIVO_ID,
      });

      expect(result).toEqual(mockResponse.data);
    });
  });
});

