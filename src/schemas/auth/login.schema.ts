import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().refine((value) => value.startsWith("mc"), {
    message: "El usuario debe comenzar con mc",
  }),
  password: z.string().min(4, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
