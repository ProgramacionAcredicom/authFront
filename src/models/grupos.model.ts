import { Aplicativo, GruposType, UserInGroup } from "@/interfaces/grupos.interfaces";

export class GruposModel {
  id: number;
  nombre: string;
  aplicativos: Aplicativo[];
  users?: UserInGroup[];
  users_count?: number;
  state: boolean;
  created_on?: string;
  update_at?: string;
  constructor(grupos: GruposType) {
    this.id = grupos.id;
    this.nombre = grupos.nombre;
    this.aplicativos = grupos.aplicativos;
    this.users = grupos.users;
    this.users_count = grupos.users_count;
    this.state = grupos.state;
    this.created_on = grupos.created_on;
    this.update_at = grupos.update_at;
  }
}
