import { z } from "zod";

export const puestoSchema = z.object({
  role: z
    .string({
      required_error: "El nombre del puesto es requerido",
    })
    .min(1, { message: "El nombre del puesto es requerido" }),
  grupos: z.array(z.number()).default([]),
  state: z.boolean().default(true),
});

export type PuestoSchema = z.infer<typeof puestoSchema>;
