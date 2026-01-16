/**
 * Logger configurable para la aplicación
 * En producción, los logs de debug se desactivan automáticamente
 */

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private shouldLog(level: LogLevel): boolean {
    // Leer variables de entorno dinámicamente para que los tests funcionen
    // En tests, import.meta.env puede no reflejar los cambios de vi.stubEnv
    // Por eso verificamos tanto PROD como MODE
    const isProduction = import.meta.env.PROD || import.meta.env.MODE === "production";
    const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === "development";
    
    // En producción, solo mostrar warn y error
    if (isProduction && !isDevelopment) {
      return level === "warn" || level === "error";
    }
    // En desarrollo o tests, mostrar todos los logs
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

