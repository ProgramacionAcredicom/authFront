import { RoleModelType } from "@/interfaces/perfilUsuario.interfaces";
import apiServices from "../configAxios";
import { localRolesMapper } from "@/mappers/local-roles.mapper";

export const getAllRoles = async (): Promise<RoleModelType[]> => {
  const res = await apiServices.get<RoleModelType[]>("/roles/");
  const roles = res.data.map((role) => localRolesMapper(role));
  return roles;
};
