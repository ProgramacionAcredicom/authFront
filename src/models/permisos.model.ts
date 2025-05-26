import { PermisosType, Result, PermisosByIDType, Aplicativo } from "@/interfaces/permisos.interfaces";

export class PermisosModel {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: Result[];
  constructor(permisos: PermisosType) {
    this.total = permisos.total;
    this.page = permisos.page;
    this.page_size = permisos.page_size;
    this.total_pages = permisos.total_pages;
    this.results = permisos.results;
  }
}

export class PermisosByIdModel {
  id: number;
  nombre: string;
  aplicativos: Aplicativo[];
  permisos: Aplicativo[];
  constructor(permisos: PermisosByIDType) {
    this.id = permisos.id;
    this.nombre = permisos.nombre;
    this.aplicativos = permisos.aplicativos;
    this.permisos = permisos.permisos;
  }
  byId() {
    return {
      id: this.id,
      nombre: this.nombre,
      aplicativos: this.aplicativos,
      permisos: this.permisos,
    };
  }
  toRows() {
    return this.aplicativos.flatMap((app) =>
      this.permisos.map((perm) => ({
        aplicativo: app.nombre,
        permiso: perm.nombre,
        id: perm.id,
      })),
    );
  }
}
