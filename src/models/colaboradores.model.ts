import { Agency, ColaboradoresType, ColaboradorIDType, Grupo, Result, Role } from "@/interfaces/colaboradores.interfaces";

export class ColaboradoresModel {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Result[];
  constructor(colaborador: ColaboradoresType) {
    this.total = colaborador.total;
    this.page = colaborador.page;
    this.page_size = colaborador.page_size;
    this.total_pages = colaborador.total_pages;
    this.results = colaborador.results;
  }
}

export class ColaboradorByIdModel {
  id: number;
  dpi: string;
  cif: string;
  ejecutivo_principal: null;
  name: string;
  username: string;
  email: string;
  picture: null;
  user_type: string;
  agency: Agency;
  role: Role;
  area: null;
  grupos: Grupo[];
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  otp_enabled: boolean;
  constructor(colaborador: ColaboradorIDType) {
    this.id = colaborador.id;
    this.name = colaborador.name;
    this.dpi = colaborador.dpi;
    this.cif = colaborador.cif;
    this.username = colaborador.username;
    this.email = colaborador.email;
    this.picture = colaborador.picture;
    this.agency = colaborador.agency;
    this.role = colaborador.role;
    this.area = colaborador.area;
    this.grupos = colaborador.grupos;
    this.is_active = colaborador.is_active;
    this.is_staff = colaborador.is_staff;
    this.is_superuser = colaborador.is_superuser;
    this.otp_enabled = colaborador.otp_enabled;
    this.user_type = colaborador.user_type;
    this.ejecutivo_principal = colaborador.ejecutivo_principal;
  }
}
