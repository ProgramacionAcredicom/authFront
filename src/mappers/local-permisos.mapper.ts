import { PermisosModel, PermisosByIdModel } from "@/models/permisos.model";
import { PermisosTypeModel, PermisosByIDType } from "@/interfaces/permisos.interfaces";

export const localPermisosMapper = (permisos: PermisosTypeModel) => {
  const mappedResults = permisos.results.map((result) => ({
    id: result.id,
    nombre: result.nombre,
    descripcion: result.descripcion || "",
    aplicativo: {
      id: result.aplicativo.id,
      nombre: result.aplicativo.nombre,
    },
  }));
  
  const permisosType = {
    total: permisos.total,
    page: permisos.page,
    page_size: permisos.page_size,
    total_pages: permisos.total_pages,
    results: mappedResults,
  };
  
  return new PermisosModel(permisosType);
};

export const localPermisosByIdMapper = (permisos: PermisosByIDType) => {
  return new PermisosByIdModel({
    id: permisos.id,
    nombre: permisos.nombre,
    aplicativos: permisos.aplicativos,
    permisos: permisos.permisos,
  });
};
