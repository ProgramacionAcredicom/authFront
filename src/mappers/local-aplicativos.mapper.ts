import { AplicativosModel } from "@/models/aplicativos.mmodel";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";

export const localAplicativosMapper = (aplicativo: AplicativosTypeModel) => {
  return new AplicativosModel({
    id: aplicativo.id,
    nombre: aplicativo.nombre,
    descripcion: aplicativo.descripcion,
    configuracion: aplicativo.configuracion,
    state: aplicativo.state,
  });
};
