import { RolesModel } from "@/models/roles.model";
import { RolesModelType } from "@/interfaces/roles.interfaces";

export const localRolesMapper = (roles: RolesModelType) => {
  return new RolesModel({
    id: roles.id,
    role: roles.role,
    state: roles.state,
  });
};
