import { getGrupoById } from "@/services/grupos/grupos.services";
import { getPermisosById } from "@/services/permisos/permisos.services";
import { LoaderFunctionArgs } from "react-router-dom";
import apiServices from "@/services/configAxios";
import { PermisosByIDType } from "@/interfaces/permisos.interfaces";

export async function GrupoLoader({ params }: LoaderFunctionArgs) {
  const grupo = await getGrupoById(params.id as string);
  const permisos = await getPermisosById(params.id as string);
  return { grupo, permisos };
}

export async function EditarGrupoLoader({ params }: LoaderFunctionArgs) {
  const grupoId = params.id as string;
  const [grupo, permisosResponse] = await Promise.all([
    getGrupoById(grupoId),
    apiServices.get<PermisosByIDType>(`/grupo/permisos/${grupoId}`),
  ]);
  return { grupo, permisosResponse: permisosResponse.data };
}

