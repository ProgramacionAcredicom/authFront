import { RolesType } from "@/interfaces/roles.interfaces";

export class RolesModel {
  id: number;
  role: string;
  state: boolean;
  constructor(roles: RolesType) {
    this.id = roles.id;
    this.role = roles.role;
    this.state = roles.state;
  }
}
