import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido" }),
});

export type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
