import { GruposTypeModel, GruposType } from "@/interfaces/grupos.interfaces";

export const localGruposMapper = (grupos: GruposType): GruposTypeModel => {
  return {
    id: grupos.id,
    nombre: grupos.nombre,
    aplicativos: grupos.aplicativos,
    permisos: grupos.aplicativos, // En el listado, permisos es igual a aplicativos
    users: grupos.users,
    state: grupos.state,
    created_on: grupos.created_on,
    update_at: grupos.update_at,
  };
};
