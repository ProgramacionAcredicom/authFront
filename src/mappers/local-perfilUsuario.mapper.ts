import type { UsuarioType } from "@/interfaces/perfilUsuario.interfaces";
import { PerilUsuarioModel } from "@/models/perfilUsuario.model";

export const localPerfilUsuarioMapper = (perfilUsuario: UsuarioType) => {
  return new PerilUsuarioModel({
    ...perfilUsuario,
    oauth_perms: perfilUsuario.oauth_perms ?? [],
  });
};
