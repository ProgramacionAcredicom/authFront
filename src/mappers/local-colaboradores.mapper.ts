import { ColaboradoresType, ColaboradorIDType } from "@/interfaces/colaboradores.interfaces";
import { ColaboradoresModel, ColaboradorByIdModel } from "@/models/colaboradores.model";

export const localColaboradoresMapper = (colaboradores: ColaboradoresType) => {
  return new ColaboradoresModel({
    page: colaboradores.page,
    page_size: colaboradores.page_size,
    total: colaboradores.total,
    total_pages: colaboradores.total_pages,
    results: colaboradores.results,
  });
};

export const localColaboradorByIdMapper = (colaborador: ColaboradorIDType) => {
  return new ColaboradorByIdModel({
    id: colaborador.id,
    name: colaborador.name,
    dpi: colaborador.dpi,
    cif: colaborador.cif,
    ejecutivo_principal: colaborador.ejecutivo_principal,
    username: colaborador.username,
    email: colaborador.email,
    picture: colaborador.picture,
    agency: colaborador.agency,
    role: colaborador.role,
    area: colaborador.area,
    grupos: colaborador.grupos,
    is_active: colaborador.is_active,
    is_staff: colaborador.is_staff,
    is_superuser: colaborador.is_superuser,
    otp_enabled: colaborador.otp_enabled,
    user_type: colaborador.user_type,
  });
};
