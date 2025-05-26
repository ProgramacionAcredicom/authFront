import { z } from "zod";

export const asignarPermisosSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  descripcion: z.string().min(1, { message: "La descripción es requerida" }),
  aplicativo: z.string().min(1, { message: "El aplicativo es requerido" }),
});

export type AsignarPermisosSchema = z.infer<typeof asignarPermisosSchema>;

export const listarPermisosSchema = z.object({
  permisos: z.array(asignarPermisosSchema).min(1, { message: "Debe agregar al menos un permiso" }),
});

export type ListarPermisosSchema = z.infer<typeof listarPermisosSchema>;
