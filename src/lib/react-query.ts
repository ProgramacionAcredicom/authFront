import { QueryClient } from "@tanstack/react-query";
import { logger } from "./logger";

/**
 * Configuración global de React Query
 * Define defaults para todas las queries y mutaciones
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos" (no necesitan refetch)
      staleTime: 1000 * 60 * 5, // 5 minutos
      // Tiempo que los datos se mantienen en caché después de no usarse
      gcTime: 1000 * 60 * 30, // 30 minutos (antes cacheTime)
      // Reintentos automáticos en caso de error
      retry: (failureCount, error) => {
        // No reintentar en errores 4xx (errores del cliente)
        if (error && typeof error === "object" && "response" in error) {
          const status = (error as { response?: { status?: number } }).response?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        // Reintentar hasta 3 veces para otros errores
        return failureCount < 3;
      },
      // Delay entre reintentos (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch automático cuando la ventana recupera el foco
      refetchOnWindowFocus: true,
      // Refetch automático al reconectar
      refetchOnReconnect: true,
      // No refetch automático al montar si los datos están frescos
      refetchOnMount: true,
    },
    mutations: {
      // Reintentos para mutaciones (solo para errores de red)
      retry: (failureCount, error) => {
        // No reintentar errores 4xx
        if (error && typeof error === "object" && "response" in error) {
          const status = (error as { response?: { status?: number } }).response?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        // Reintentar hasta 2 veces solo para errores de red
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Log de errores de queries (útil para debugging)
queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === "error") {
    logger.errorWithContext("Error en query cache", event.error, {
      queryKey: event.query.queryKey,
    });
  }
});
