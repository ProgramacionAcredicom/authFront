import { PermisosModel, PermisosByIdModel } from "@/models/permisos.model";
import { PermisosTypeModel, PermisosByIDType } from "@/interfaces/permisos.interfaces";

export const localPermisosMapper = (permisos: PermisosTypeModel) => {
  return new PermisosModel({
    total: permisos.total,
    page: permisos.page,
    page_size: permisos.page_size,
    total_pages: permisos.total_pages,
    results: permisos.results.map((result) => ({
      id: result.id,
      permiso: result.nombre,
      descripcion: result.descripcion,
      aplicativo: result.aplicativo,
    })),
  });
};

export const localPermisosByIdMapper = (permisos: PermisosByIDType) => {
  return new PermisosByIdModel({
    id: permisos.id,
    nombre: permisos.nombre,
    aplicativos: permisos.aplicativos,
    permisos: permisos.permisos,
  });
};
