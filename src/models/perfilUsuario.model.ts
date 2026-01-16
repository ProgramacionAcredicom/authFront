import { Agency, Grupo, Role, UsuarioType, UserType } from "@/interfaces/perfilUsuario.interfaces";

export class PerilUsuarioModel {
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
  mfa_method?: 'totp' | 'email' | null;
  constructor(perfilUsuario: UsuarioType) {
    this.id = perfilUsuario.id;
    this.dpi = perfilUsuario.dpi;
    this.cif = perfilUsuario.cif;
    this.name = perfilUsuario.name;
    this.username = perfilUsuario.username;
    this.email = perfilUsuario.email;
    this.user_type = perfilUsuario.user_type;
    this.agency = perfilUsuario.agency;
    this.role = perfilUsuario.role;
    this.is_active = perfilUsuario.is_active;
    this.is_staff = perfilUsuario.is_staff;
    this.is_superuser = perfilUsuario.is_superuser;
    this.otp_enabled = perfilUsuario.otp_enabled;
    this.mfa_method = perfilUsuario.mfa_method;
    this.picture = perfilUsuario.picture;
    this.area = perfilUsuario.area;
    this.grupos = perfilUsuario.grupos;
    this.ejecutivo_principal = perfilUsuario.ejecutivo_principal;
  }
}
