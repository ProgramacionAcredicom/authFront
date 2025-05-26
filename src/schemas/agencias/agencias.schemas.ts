import { z } from "zod";

export const agenciasSchema = z.object({
    code: z
    .string({
      required_error: "El código es requerido",
      invalid_type_error: "El código debe ser un texto válido",
    }).max(5, {
        message: "Máximo 5 caracteres",
    }).min(1, {
        message: "El código es requerido",
    })
    .refine((data) => data.toLowerCase().startsWith("mc"), {
      message: "El código debe empezar con 'mc'",
    }),
    name: z.string({
        message: "El nombre es requerido",
        required_error: "El nombre es requerido",
    }).min(1, {
        message: "Campo requerido",
    }),
    chif: z.number({
        message: "Este campo es requerido",
        required_error: "Este campo es requerido",
    }).min(1, {
        message: "Este campo es requerido",
    }),
    state: z.boolean({
        message: "El estado es requerido",
        required_error: "El estado es requerido",
    }).default(false),
})

export type AgenciasSchema = z.infer<typeof agenciasSchema>;