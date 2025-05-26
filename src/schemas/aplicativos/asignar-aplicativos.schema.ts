import { z } from "zod";

export const asignarAplicativosSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  descripcion: z.string().min(1, { message: "La descripción es requerida" }),
  configuracion: z
    .string()
    // 1) Validamos sólo si hay algo escrito:
    .refine(
      (val) => {
        if (val.trim() === "") return true; // cadenas vacías → OK
        try {
          JSON.parse(val);
          return true; // JSON válido → OK
        } catch {
          return false; // JSON inválido → ERROR
        }
      },
      { message: "JSON inválido" },
    )
    // 2) Transformamos la cadena: empty → null, JSON.parse → objeto
    .transform((val) => {
      if (val.trim() === "") return null;
      return JSON.parse(val);
    }),
});

export type AsignarAplicativosSchema = z.infer<typeof asignarAplicativosSchema>;
