import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "../logger";

describe("Logger", () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods
    global.console.debug = vi.fn();
    global.console.info = vi.fn();
    global.console.warn = vi.fn();
    global.console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("en desarrollo", () => {
    beforeEach(() => {
      vi.stubEnv("DEV", "true");
      vi.stubEnv("PROD", "false");
    });

    it("debe loggear mensajes debug", () => {
      logger.debug("test debug");
      expect(console.debug).toHaveBeenCalledWith("[DEBUG]", "test debug");
    });

    it("debe loggear mensajes info", () => {
      logger.info("test info");
      expect(console.info).toHaveBeenCalledWith("[INFO]", "test info");
    });

    it("debe loggear mensajes warn", () => {
      logger.warn("test warn");
      expect(console.warn).toHaveBeenCalledWith("[WARN]", "test warn");
    });

    it("debe loggear mensajes error", () => {
      logger.error("test error");
      expect(console.error).toHaveBeenCalledWith("[ERROR]", "test error");
    });

    it("debe loggear errores con contexto", () => {
      const error = new Error("test error");
      const context = { userId: 123 };
      logger.errorWithContext("test message", error, context);
      expect(console.error).toHaveBeenCalledWith(
        "[ERROR]",
        "test message",
        expect.objectContaining({
          error,
          context,
          timestamp: expect.any(String),
        }),
      );
    });
  });

  describe("en producción", () => {
    beforeEach(() => {
      vi.stubEnv("DEV", "false");
      vi.stubEnv("PROD", "true");
    });

    it("no debe loggear mensajes debug", () => {
      logger.debug("test debug");
      expect(console.debug).not.toHaveBeenCalled();
    });

    it("no debe loggear mensajes info", () => {
      logger.info("test info");
      expect(console.info).not.toHaveBeenCalled();
    });

    it("debe loggear mensajes warn", () => {
      logger.warn("test warn");
      expect(console.warn).toHaveBeenCalledWith("[WARN]", "test warn");
    });

    it("debe loggear mensajes error", () => {
      logger.error("test error");
      expect(console.error).toHaveBeenCalledWith("[ERROR]", "test error");
    });
  });
});

