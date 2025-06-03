import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, {
    message: "El usuario es requerido",
  }),
  password: z.string().min(4, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
