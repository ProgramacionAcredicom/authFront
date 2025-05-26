import { getPermisoById } from "@/services/permisos/permisos.services";
import { LoaderFunctionArgs } from "react-router-dom";

export async function PermisoLoader({ params }: LoaderFunctionArgs) {
  const permiso = await getPermisoById(params.id as string);
  return { permiso };
}
