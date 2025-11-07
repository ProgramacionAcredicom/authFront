import { GruposModel } from "@/models/grupos.model";
import { GruposType } from "@/interfaces/grupos.interfaces";

export const localGruposMapper = (grupos: GruposType) => {
  return new GruposModel({
    id: grupos.id,
    nombre: grupos.nombre,
    aplicativos: grupos.aplicativos,
    users: grupos.users,
    state: grupos.state,
    created_on: grupos.created_on,
    update_at: grupos.update_at,
  });
};
