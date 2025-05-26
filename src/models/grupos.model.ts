import { AplicativoModel, GruposType } from "@/interfaces/grupos.interfaces";

export class GruposModel {
  id: number;
  nombre: string;
  aplicativos: AplicativoModel[];
  constructor(grupos: GruposType) {
    this.id = grupos.id;
    this.nombre = grupos.nombre;
    this.aplicativos = grupos.aplicativos;
  }
}
