import { z } from "zod";

const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

/**
 * Valida que una URL no sea de desarrollo en producción
 */
const validateProductionUrl = (url: string, varName: string): string => {
  if (isProduction) {
    const lowerUrl = url.toLowerCase();
    const devPatterns = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      ":5173", // Vite dev server
      ":3000", // Common dev port
      ":8000", // Common backend dev port
    ];

    const isDevUrl = devPatterns.some((pattern) => lowerUrl.includes(pattern));
    if (isDevUrl) {
      throw new Error(
        `${varName} no puede ser una URL de desarrollo en producción. URL proporcionada: ${url}`,
      );
    }
  }
  return url;
};

/**
 * Schema de validación para variables de entorno
 * Todas las variables requeridas deben estar definidas
 */
const envSchema = z.object({
  VITE_HOST_AUTH_DEV: z
    .string()
    .url("VITE_HOST_AUTH_DEV debe ser una URL válida")
    .refine(
      (url) => {
        try {
          validateProductionUrl(url, "VITE_HOST_AUTH_DEV");
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "VITE_HOST_AUTH_DEV no puede ser una URL de desarrollo en producción",
      },
    ),
  VITE_APLICATIVO_ID: z
    .string()
    .transform((val) => {
      const num = Number.parseInt(val, 10);
      if (Number.isNaN(num)) {
        throw new Error("VITE_APLICATIVO_ID debe ser un número válido");
      }
      return num;
    })
    .pipe(z.number().positive("VITE_APLICATIVO_ID debe ser un número positivo")),
  VITE_PASSWORD_RESET_REDIRECT_URL: z.string().optional().default("/auth/login"),
  VITE_APP_NAME: z.string().optional().default("Acredicom Auth"),
  VITE_API_BASE_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:8000")
    .refine(
      (url) => {
        if (!url) return true;
        try {
          validateProductionUrl(url, "VITE_API_BASE_URL");
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "VITE_API_BASE_URL no puede ser una URL de desarrollo en producción",
      },
    ),
});

/**
 * Valida y parsea las variables de entorno
 * Lanza un error si alguna variable requerida falta o es inválida
 */
function validateEnv() {
  try {
    return envSchema.parse({
      VITE_HOST_AUTH_DEV: import.meta.env.VITE_HOST_AUTH_DEV,
      VITE_APLICATIVO_ID: import.meta.env.VITE_APLICATIVO_ID,
      VITE_PASSWORD_RESET_REDIRECT_URL: import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL,
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
      throw new Error(`Error de validación de variables de entorno:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Variables de entorno validadas y tipadas
 * Se valida una sola vez al importar el módulo
 */
export const env = validateEnv();

/**
 * Configuración de la aplicación basada en variables de entorno
 * 
 * NOTA DE SEGURIDAD:
 * - Los tokens JWT se almacenan en localStorage mediante zustand/persist
 * - localStorage es vulnerable a ataques XSS si hay código malicioso en la aplicación
 * - Consideraciones:
 *   - Implementar Content Security Policy (CSP) estricta
 *   - Sanitizar todas las entradas del usuario
 *   - Usar httpOnly cookies como alternativa más segura (requiere cambios en backend)
 *   - Los tokens tienen tiempo de expiración limitado
 */
export const environment = {
  passwordResetRedirectUrl: env.VITE_PASSWORD_RESET_REDIRECT_URL,
  appName: env.VITE_APP_NAME,
  apiBaseUrl: env.VITE_API_BASE_URL,
  hostAuthDev: env.VITE_HOST_AUTH_DEV,
  aplicativoId: env.VITE_APLICATIVO_ID,
  isProduction,
  isDevelopment,
} as const;

