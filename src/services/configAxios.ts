import { useAuthStore } from "@/store/useAuth.store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshToken } from "./auth/auth.services";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import { TIMEOUTS } from "@/config/constants";

// Configuración de timeout y reintentos
const REQUEST_TIMEOUT = TIMEOUTS.REQUEST_TIMEOUT;
const MAX_RETRY_ATTEMPTS = TIMEOUTS.MAX_RETRY_ATTEMPTS;

// Contador de reintentos de refresh token por request
const refreshTokenRetryCount = new WeakMap<InternalAxiosRequestConfig, number>();

const apiServices = axios.create({
  baseURL: env.VITE_HOST_AUTH_DEV,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requests
apiServices.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();
    if (authStore.access) {
      config.headers.Authorization = `Bearer ${authStore.access}`;
    }
    return config;
  },
  (error) => {
    logger.errorWithContext("Error en interceptor de request", error);
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores de Axios
apiServices.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si no hay config, no podemos reintentar
    if (!originalRequest) {
      logger.errorWithContext("Error sin config en interceptor", error);
      return Promise.reject(error);
    }

    const authStore = useAuthStore.getState();

    // Manejar errores de red (sin respuesta del servidor)
    if (!error.response) {
      logger.warn("Error de red - sin respuesta del servidor", {
        message: error.message,
        url: originalRequest.url,
      });
      return Promise.reject(error);
    }

    // Manejar sesión expirada o token inválido
    const isSessionExpired =
      error.response?.data?.error?.includes("La sesión ha expirado o no es válida.") ||
      error.response?.status === 401;

    if (isSessionExpired && !originalRequest._retry) {
      // Obtener contador de reintentos para este request
      const retryCount = refreshTokenRetryCount.get(originalRequest) || 0;

      // Prevenir loops infinitos
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        logger.error("Máximo de reintentos de refresh token alcanzado", {
          url: originalRequest.url,
          retryCount,
        });
        authStore.logout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      refreshTokenRetryCount.set(originalRequest, retryCount + 1);

      // Si no hay refresh token, hacer logout
      if (!authStore.refresh) {
        logger.warn("No hay refresh token disponible, cerrando sesión");
        authStore.logout();
        return Promise.reject(error);
      }

      try {
        logger.debug("Intentando refrescar token", { retryCount: retryCount + 1 });
        const newAccessToken = await refreshToken({ refresh: authStore.refresh });

        // Actualizar token en store y headers
        authStore.setAccessToken(newAccessToken.access);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken.access}`;

        // Limpiar contador de reintentos
        refreshTokenRetryCount.delete(originalRequest);

        // Reintentar request original
        return apiServices(originalRequest);
      } catch (refreshError) {
        // Limpiar contador
        refreshTokenRetryCount.delete(originalRequest);

        if (refreshError instanceof AxiosError) {
          const isNoActiveSession = refreshError.response?.data?.error?.includes(
            "No hay sesión activa para este usuario.",
          );

          if (isNoActiveSession) {
            logger.warn("No hay sesión activa, cerrando sesión");
            authStore.logout();
          } else {
            logger.errorWithContext("Error al refrescar token", refreshError, {
              originalUrl: originalRequest.url,
            });
          }
        } else {
          logger.errorWithContext("Error inesperado al refrescar token", refreshError);
        }

        return Promise.reject(refreshError);
      }
    }

    // Para otros errores 401, hacer logout
    if (error.response?.status === 401 && !isSessionExpired) {
      logger.warn("Error 401 no relacionado con sesión expirada, cerrando sesión");
      authStore.logout();
    }

    return Promise.reject(error);
  },
);

export default apiServices;
