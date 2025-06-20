import { Aplicativo, GruposType } from "@/interfaces/grupos.interfaces";

export class GruposModel {
  id: number;
  nombre: string;
  aplicativos: Aplicativo[];
  state: boolean;
  constructor(grupos: GruposType) {
    this.id = grupos.id;
    this.nombre = grupos.nombre;
    this.aplicativos = grupos.aplicativos;
    this.state = grupos.state;
  }
}
