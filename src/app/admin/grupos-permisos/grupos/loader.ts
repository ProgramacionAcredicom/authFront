import { getGrupoById } from "@/services/grupos/grupos.services";
import { getPermisosById } from "@/services/permisos/permisos.services";
import { LoaderFunctionArgs } from "react-router-dom";

export async function GrupoLoader({ params }: LoaderFunctionArgs) {
  const grupo = await getGrupoById(params.id as string);
  const permisos = await getPermisosById(params.id as string);
  return { grupo, permisos };
}

