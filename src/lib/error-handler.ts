import { AxiosError } from "axios";
import { toast } from "sonner";
import { logger } from "./logger";

/**
 * Tipos de errores comunes de la API
 */
interface ApiErrorResponse {
  error?: string | string[];
  code?: string[];
  name?: string[];
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Opciones para el manejo de errores
 */
interface ErrorHandlerOptions {
  /** Mensaje de error personalizado */
  customMessage?: string;
  /** Si se debe mostrar un toast de error */
  showToast?: boolean;
  /** Callback personalizado para manejar el error */
  onError?: (error: unknown) => void;
  /** Mapeo de códigos de error a mensajes personalizados */
  errorMessages?: Record<string, string>;
}

/**
 * Maneja errores de Axios de forma consistente
 * @param error - El error a manejar
 * @param options - Opciones de configuración
 */
export function handleApiError(error: unknown, options: ErrorHandlerOptions = {}): string {
  const { customMessage, showToast = true, onError, errorMessages = {} } = options;

  // Si hay un callback personalizado, ejecutarlo primero
  if (onError) {
    onError(error);
  }

  let errorMessage = customMessage || "Ha ocurrido un error";

  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const { data, status } = axiosError.response || {};

    // Log del error con contexto
    logger.errorWithContext("Error de API", error, {
      status,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      responseData: data,
    });

    // Manejar errores específicos por código de estado
    if (status === 401) {
      errorMessage = "No autorizado. Por favor, inicia sesión nuevamente.";
    } else if (status === 403) {
      errorMessage = "No tienes permisos para realizar esta acción.";
    } else if (status === 404) {
      errorMessage = "El recurso solicitado no fue encontrado.";
    } else if (status === 422) {
      // Errores de validación
      if (data?.error) {
        errorMessage = Array.isArray(data.error) ? data.error.join(", ") : data.error;
      } else if (data?.detail) {
        errorMessage = data.detail;
      }
    } else if (status === 500) {
      errorMessage = "Error interno del servidor. Por favor, intenta más tarde.";
    } else if (data?.error) {
      // Mensaje de error del servidor
      errorMessage = Array.isArray(data.error) ? data.error.join(", ") : data.error;
    } else if (data?.message) {
      errorMessage = data.message;
    } else if (data?.detail) {
      errorMessage = data.detail;
    }

    // Verificar mensajes personalizados por código de error
    if (data?.code && Array.isArray(data.code)) {
      for (const code of data.code) {
        const lowerCode = code.toLowerCase();
        if (errorMessages[lowerCode]) {
          errorMessage = errorMessages[lowerCode];
          break;
        }
        // Mensajes comunes
        if (lowerCode.includes("code already exists")) {
          errorMessage = "Ya existe un registro con este código";
        } else if (lowerCode.includes("name already exists")) {
          errorMessage = "Ya existe un registro con este nombre";
        }
      }
    }

    if (data?.name && Array.isArray(data.name)) {
      for (const name of data.name) {
        const lowerName = name.toLowerCase();
        if (errorMessages[lowerName]) {
          errorMessage = errorMessages[lowerName];
          break;
        }
        if (lowerName.includes("name already exists")) {
          errorMessage = "Ya existe un registro con este nombre";
        }
      }
    }
  } else if (error instanceof Error) {
    // Error estándar de JavaScript
    logger.errorWithContext("Error de JavaScript", error);
    errorMessage = error.message || customMessage || "Ha ocurrido un error";
  } else {
    // Error desconocido
    logger.errorWithContext("Error desconocido", error);
    errorMessage = customMessage || "Ha ocurrido un error desconocido";
  }

  // Mostrar toast si está habilitado
  if (showToast) {
    toast.error(errorMessage);
  }

  return errorMessage;
}

/**
 * Hook para usar el manejador de errores en componentes React
 */
export function useErrorHandler() {
  return {
    handleError: (error: unknown, options?: ErrorHandlerOptions) => handleApiError(error, options),
  };
}

/**
 * Crea un manejador de errores preconfigurado para un contexto específico
 */
export function createErrorHandler(context: string, defaultMessages?: Record<string, string>) {
  return (error: unknown, options?: ErrorHandlerOptions) => {
    return handleApiError(error, {
      ...options,
      errorMessages: {
        ...defaultMessages,
        ...options?.errorMessages,
      },
      onError: (err) => {
        logger.errorWithContext(`Error en ${context}`, err);
        options?.onError?.(err);
      },
    });
  };
}

