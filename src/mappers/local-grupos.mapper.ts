import { GruposModel } from "@/models/grupos.model";
import { GruposType } from "@/interfaces/grupos.interfaces";

export const localGruposMapper = (grupos: GruposType) => {
  return new GruposModel({
    id: grupos.id,
    nombre: grupos.nombre,
    aplicativos: grupos.aplicativos,
  });
};
