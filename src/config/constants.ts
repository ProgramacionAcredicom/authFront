/**
 * Constantes de configuración de la aplicación
 */

// Tamaños de página para paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  LARGE_PAGE_SIZE: 100,
  MAX_PAGE_SIZE: 1000,
} as const;

// Timeouts y delays
export const TIMEOUTS = {
  REQUEST_TIMEOUT: 30000, // 30 segundos
  RETRY_DELAY_BASE: 1000, // 1 segundo
  MAX_RETRY_ATTEMPTS: 3,
} as const;

// Tiempos de caché para React Query (en milisegundos)
export const CACHE_TIMES = {
  // Datos estáticos (agencias, roles, etc.)
  STATIC_DATA: 1000 * 60 * 10, // 10 minutos
  STATIC_DATA_GC: 1000 * 60 * 60, // 1 hora

  // Datos relativamente estáticos (grupos, permisos)
  SEMI_STATIC_DATA: 1000 * 60 * 5, // 5 minutos
  SEMI_STATIC_DATA_GC: 1000 * 60 * 30, // 30 minutos

  // Datos dinámicos (colaboradores, sesiones)
  DYNAMIC_DATA: 1000 * 60 * 2, // 2 minutos
  DYNAMIC_DATA_GC: 1000 * 60 * 15, // 15 minutos
} as const;

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Error de conexión. Por favor, verifica tu conexión a internet.",
  UNAUTHORIZED: "No autorizado. Por favor, inicia sesión nuevamente.",
  FORBIDDEN: "No tienes permisos para realizar esta acción.",
  NOT_FOUND: "El recurso solicitado no fue encontrado.",
  SERVER_ERROR: "Error interno del servidor. Por favor, intenta más tarde.",
  VALIDATION_ERROR: "Por favor, corrige los errores en el formulario.",
  UNKNOWN_ERROR: "Ha ocurrido un error desconocido.",
} as const;

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  CREATED: "Creado correctamente",
  UPDATED: "Actualizado correctamente",
  DELETED: "Eliminado correctamente",
  SAVED: "Guardado correctamente",
} as const;

