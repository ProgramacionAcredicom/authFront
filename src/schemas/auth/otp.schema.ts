import { z } from "zod";

export const OTPSchema = z
  .object({
    email: z.string().email({ message: "El correo electrónico no es válido" }),
    otp: z.string().min(6, { message: "El código OTP debe tener 6 dígitos" }),
    new_password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirm_password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Las contraseñas no coinciden",
  });

export type OTPSchemaType = z.infer<typeof OTPSchema>;
