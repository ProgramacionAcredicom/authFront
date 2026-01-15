import { z } from "zod";

/**
 * Schema de validación para código MFA
 * 
 * Acepta:
 * - Código TOTP: 6 dígitos numéricos
 * - Código de respaldo: 8 caracteres alfanuméricos
 */
const mfaCodeSchema = z
  .string()
  .min(1, {
    message: "El código es requerido",
  })
  .refine(
    (value) => {
      // Código TOTP: exactamente 6 dígitos
      const isTotp = /^\d{6}$/.test(value);
      // Código de respaldo: 8 caracteres alfanuméricos
      const isBackupCode = /^[A-Za-z0-9]{8}$/.test(value);
      return isTotp || isBackupCode;
    },
    {
      message: "El código debe tener 6 dígitos (TOTP) o 8 caracteres alfanuméricos (código de respaldo)",
    }
  );

export const mfaVerifySchema = z.object({
  code: mfaCodeSchema,
});

export type MFAVerifySchemaType = z.infer<typeof mfaVerifySchema>;
