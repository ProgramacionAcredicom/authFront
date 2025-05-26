import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";

export class AplicativosModel {
  id: number;
  nombre: string;
  descripcion: string;
  configuracion: null | object;
  constructor(aplicativo: AplicativosTypeModel) {
    this.id = aplicativo.id;
    this.nombre = aplicativo.nombre;
    this.descripcion = aplicativo.descripcion;
    this.configuracion = aplicativo.configuracion;
  }
}
