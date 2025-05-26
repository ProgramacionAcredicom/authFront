import { PerilUsuarioModel } from "@/models/perfilUsuario.model";

interface UsuarioType {
  id: number;
  dpi: string;
  cif: string;
  ejecutivo_principal: null;
  name: string;
  username: string;
  email: string;
  picture: string;
  user_type: UserType;
  agency: Agency;
  role: Role;
  area: Agency;
  grupos: Grupo[];
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  otp_enabled: boolean;
}

interface Agency {
  id: number;
  name: string;
  code: string;
  state?: boolean;
  chif?: Chif;
}

interface Chif {
  id: number;
  name: string;
  email: string;
  picture: null;
}

interface Grupo {
  id: number;
  nombre: string;
  permisos: Permiso[];
}

interface Permiso {
  id: number;
  nombre: string;
}

interface Role {
  id: number;
  role: string;
  state: boolean;
}
enum UserType {
  USUARIO = "Usuario",
  KIOSCO = "Kiosco",
  CONSEJO = "Consejo",
  PROYECTO_DIALOGO = "Proyecto Dialogo",
  PRADERA = "Pradera",
  PROYECTO_FORESTAL = "Proyecto Forestal",
  OTRO = "Otro",
}

export const localPerfilUsuarioMapper = (perfilUsuario: UsuarioType) => {
  return new PerilUsuarioModel({
    id: perfilUsuario.id,
    dpi: perfilUsuario.dpi,
    cif: perfilUsuario.cif,
    ejecutivo_principal: perfilUsuario.ejecutivo_principal,
    name: perfilUsuario.name,
    username: perfilUsuario.username,
    email: perfilUsuario.email,
    picture: perfilUsuario.picture,
    user_type: perfilUsuario.user_type,
    agency: perfilUsuario.agency,
    role: perfilUsuario.role,
    area: perfilUsuario.area,
    grupos: perfilUsuario.grupos,
    is_active: perfilUsuario.is_active,
    is_staff: perfilUsuario.is_staff,
    is_superuser: perfilUsuario.is_superuser,
    otp_enabled: perfilUsuario.otp_enabled,
  });
};
