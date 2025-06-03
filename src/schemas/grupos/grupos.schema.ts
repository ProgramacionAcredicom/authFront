import { z } from "zod";

export const crearGrupoSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
    })
    .min(1, { message: "El nombre es requerido" }),
  permisos: z
    .array(
      z.number({
        required_error: "Selecciona al menos uno",
      }),
    )
    .min(1, { message: "Selecciona al menos uno" }),
  state: z.boolean().default(true),
});

export type CrearGrupoSchema = z.infer<typeof crearGrupoSchema>;

export const eliminarGrupoSchema = z.object({
  aplicativo: z.string({
    required_error: "El aplicativo es requerido",
  }),
  nombre: z.string({
    required_error: "El nombre es requerido",
  }),
});

export type EliminarGrupoSchema = z.infer<typeof eliminarGrupoSchema>;
