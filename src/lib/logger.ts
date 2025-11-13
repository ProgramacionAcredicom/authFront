/**
 * Logger configurable para la aplicación
 * En producción, los logs de debug se desactivan automáticamente
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // En producción, solo mostrar warn y error
    if (isProduction) {
      return level === "warn" || level === "error";
    }
    // En desarrollo, mostrar todos los logs
    return true;
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug("[DEBUG]", ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.info("[INFO]", ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn("[WARN]", ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error("[ERROR]", ...args);
    }
  }

  /**
   * Log de errores con contexto adicional
   */
  errorWithContext(message: string, error: unknown, context?: Record<string, unknown>): void {
    if (this.shouldLog("error")) {
      console.error("[ERROR]", message, {
        error,
        context,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * Instancia singleton del logger
 */
export const logger = new Logger();

/**
 * Hook para usar el logger en componentes React
 */
export const useLogger = () => logger;

