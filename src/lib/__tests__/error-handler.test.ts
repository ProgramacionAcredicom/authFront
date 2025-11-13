import { describe, it, expect, vi } from "vitest";
import { AxiosError } from "axios";
import { handleApiError } from "../error-handler";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("handleApiError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe manejar errores 401", () => {
    const error = new AxiosError("Unauthorized");
    error.response = {
      status: 401,
      data: {},
    } as any;

    const message = handleApiError(error);
    expect(message).toBe("No autorizado. Por favor, inicia sesión nuevamente.");
    expect(toast.error).toHaveBeenCalledWith(message);
  });

  it("debe manejar errores 403", () => {
    const error = new AxiosError("Forbidden");
    error.response = {
      status: 403,
      data: {},
    } as any;

    const message = handleApiError(error);
    expect(message).toBe("No tienes permisos para realizar esta acción.");
    expect(toast.error).toHaveBeenCalledWith(message);
  });

  it("debe manejar errores 404", () => {
    const error = new AxiosError("Not Found");
    error.response = {
      status: 404,
      data: {},
    } as any;

    const message = handleApiError(error);
    expect(message).toBe("El recurso solicitado no fue encontrado.");
    expect(toast.error).toHaveBeenCalledWith(message);
  });

  it("debe manejar errores 500", () => {
    const error = new AxiosError("Internal Server Error");
    error.response = {
      status: 500,
      data: {},
    } as any;

    const message = handleApiError(error);
    expect(message).toBe("Error interno del servidor. Por favor, intenta más tarde.");
    expect(toast.error).toHaveBeenCalledWith(message);
  });

  it("debe manejar errores con mensaje del servidor", () => {
    const error = new AxiosError("Error");
    error.response = {
      status: 400,
      data: {
        error: "Error personalizado del servidor",
      },
    } as any;

    const message = handleApiError(error);
    expect(message).toBe("Error personalizado del servidor");
    expect(toast.error).toHaveBeenCalledWith(message);
  });

  it("debe manejar errores de JavaScript estándar", () => {
    const error = new Error("Error de JavaScript");
    const message = handleApiError(error);
    expect(message).toBe("Error de JavaScript");
    expect(toast.error).toHaveBeenCalledWith(message);
  });

  it("debe usar mensaje personalizado si se proporciona", () => {
    const error = new Error("Error");
    const customMessage = "Mensaje personalizado";
    const message = handleApiError(error, { customMessage });
    expect(message).toBe(customMessage);
    expect(toast.error).toHaveBeenCalledWith(customMessage);
  });

  it("no debe mostrar toast si showToast es false", () => {
    const error = new Error("Error");
    handleApiError(error, { showToast: false });
    expect(toast.error).not.toHaveBeenCalled();
  });
});

