import { describe, it, expect, vi, beforeEach } from "vitest";
import { env, environment } from "../env";

describe("Configuración de variables de entorno", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("debe validar variables de entorno requeridas", () => {
    // Este test requiere que las variables estén definidas en el entorno de test
    // En un entorno real, deberías mockear import.meta.env
    expect(env.VITE_HOST_AUTH_DEV).toBeDefined();
    expect(env.VITE_APLICATIVO_ID).toBeDefined();
  });

  it("debe exportar environment con valores por defecto", () => {
    expect(environment).toBeDefined();
    expect(environment.passwordResetRedirectUrl).toBeDefined();
    expect(environment.appName).toBeDefined();
  });
});

