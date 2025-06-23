import { z } from "zod";
import { UserType } from "@/interfaces/colaboradores.interfaces";

export const colaboradorSchema = z
  .object({
    password: z
      .string({
        required_error: "La contraseña es requerida",
      })
      .optional(),
    confirm_password: z
      .string({
        required_error: "La confirmación de contraseña es requerida",
      })
      .optional(),
    executive_number: z
      .string({
        required_error: "El número de ejecutivo es requerido",
      })
      .nullable(),
    name: z
      .string({
        required_error: "El nombre es requerido",
      })
      .min(1, {
        message: "El nombre es requerido",
      })
      .trim(),
    dpi: z
      .string({
        required_error: "El DPI es requerido",
      })
      .length(13, {
        message: "El DPI debe tener exactamente 13 dígitos",
      })
      .regex(/^\d+$/, {
        message: "El DPI solo debe contener números",
      })
      .trim(),
    cif: z
      .string({
        required_error: "El id es requerido",
      })
      .min(1, {
        message: "El id es requerido",
      })
      .regex(/^\d+$/, {
        message: "El ID solo debe contener números",
      })
      .trim(),
    username: z
      .string({
        required_error: "El username es requerido",
      })
      .min(1, {
        message: "El username es requerido",
      })
      .trim(),
    email: z
      .string({
        required_error: "El correo es requerido",
      })
      .email({
        message: "El correo debe ser válido",
      })
      .trim(),
    picture: z
      .union([z.string().url().nullable(), z.instanceof(File), z.null()])
      .optional()
      .nullable(),
    agency: z
      .string({
        required_error: "La agencia es requerida",
      })
      .min(1, {
        message: "La agencia es requerida",
      }),
    role: z
      .string({
        required_error: "El puesto es requerido",
      })
      .min(1, {
        message: "El puesto es requerido",
      }),
    grup: z.array(
      z.number({
        required_error: "El grupo es requerido",
      }),
    ),
    user_type: z.enum(Object.values(UserType) as [string, ...string[]], {
      required_error: "El tipo de usuario es requerido",
      invalid_type_error: "Deber ser 'USUARIO' | 'KIOSCO' | 'CONSEJO' | 'PROYECTO_DIALOGO' | 'PRADERA' | 'PROYECTO_FORESTAL' | 'OTRO'",
      message: "Seleccione 'USUARIO' | 'KIOSCO' | 'CONSEJO' | 'PROYECTO_DIALOGO' | 'PRADERA' | 'PROYECTO_FORESTAL' | 'OTRO'",
    }),
    area: z
      .string({
        required_error: "El area es requerida",
      })
      .optional(),
    is_active: z.boolean({
      required_error: "El estado es requerido",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export type ColaboradorSchema = z.infer<typeof colaboradorSchema>;
