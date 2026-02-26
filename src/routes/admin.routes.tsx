import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import LayoutAdmin from "@/app/admin/layout";
import { ColaboradorLoader } from "@/app/admin/colaboradores/editarColaborador/loader";
import { AplicativoLoader } from "@/app/admin/grupos-permisos/aplicativos/loader";
import { PermisoLoader } from "@/app/admin/grupos-permisos/permisos/loader";
import { GrupoLoader, EditarGrupoLoader } from "@/app/admin/grupos-permisos/grupos/loader";

// Lazy load de páginas admin
const AdminPage = lazy(() => import("@/app/admin/page").then((m) => ({ default: m.default })));
const ColaboradoresPage = lazy(() => import("@/app/admin/colaboradores/page").then((m) => ({ default: m.ColaboradoresPage })));
const AgenciasPage = lazy(() => import("@/app/admin/agencias/page").then((m) => ({ default: m.AgenciasPage })));
const AreasPage = lazy(() => import("@/app/admin/areas/page").then((m) => ({ default: m.default })));
const GruposPage = lazy(() => import("@/app/admin/grupos-permisos/grupos/page").then((m) => ({ default: m.GruposPage })));
const PermisosPage = lazy(() => import("@/app/admin/grupos-permisos/permisos/page").then((m) => ({ default: m.default })));
const AplicativosPage = lazy(() => import("@/app/admin/grupos-permisos/aplicativos/page").then((m) => ({ default: m.AplicativosPage })));
const AgregarColaboradorPage = lazy(() => import("@/app/admin/colaboradores/agregarColaborador/page").then((m) => ({ default: m.AgregarColaboradorPage })));
const EditarColaboradorPage = lazy(() => import("@/app/admin/colaboradores/editarColaborador/page").then((m) => ({ default: m.EditarColaboradorPage })));
const ModalAsignarAplicativo = lazy(() => import("@/components/modal/aplicativos/modal-asignar-aplicativo").then((m) => ({ default: m.ModalAsignarAplicativo })));
const ModalEliminarAplicativo = lazy(() => import("@/components/modal/aplicativos/modal-eliminar-aplicativo").then((m) => ({ default: m.ModalEliminarAplicativo })));
const ModalEditarPermiso = lazy(() => import("@/components/modal/permisos/modal-editar-permiso").then((m) => ({ default: m.ModalEditarPermiso })));
const ModalEliminarPermiso = lazy(() => import("@/components/modal/permisos/modal-eliminar-permiso").then((m) => ({ default: m.ModalEliminarPermiso })));
const ModalEliminarGrupo = lazy(() => import("@/components/modal/grupos/modal-eliminar-grupo").then((m) => ({ default: m.ModalEliminarGrupo })));
const EditarGrupoPage = lazy(() => import("@/app/admin/grupos-permisos/grupos/editar-grupo/page").then((m) => ({ default: m.EditarGrupoPage })));

/**
 * Rutas de administración (requieren autenticación)
 */
export const adminRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
  // Agencias
  {
    path: "agencias",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <AgenciasPage />,
      },
    ],
  },
  // Areas
  {
    path: "areas",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <AreasPage />,
      },
    ],
  },
  // Grupos
  {
    path: "grupos",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <GruposPage />,
      },
      {
        path: "editar/:id",
        element: <EditarGrupoPage />,
        loader: EditarGrupoLoader,
      },
      {
        path: "eliminar/:id",
        element: <ModalEliminarGrupo />,
        loader: GrupoLoader,
      },
    ],
  },
  // Permisos
  {
    path: "permisos",
    element: <LayoutAdmin />,
    children: [
      {
        element: <PermisosPage />,
        children: [
          {
            index: true,
            element: <></>,
          },
          {
            path: "editar/:id",
            element: <ModalEditarPermiso />,
            loader: PermisoLoader,
          },
          {
            path: "eliminar/:id",
            element: <ModalEliminarPermiso />,
            loader: PermisoLoader,
          },
        ],
      },
    ],
  },
  // Aplicativos
  {
    path: "aplicativos",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <AplicativosPage />,
      },
      {
        path: "nuevo",
        element: <ModalAsignarAplicativo />,
      },
      {
        path: "editar/:id",
        element: <ModalAsignarAplicativo />,
        loader: AplicativoLoader,
      },
      {
        path: "eliminar/:id",
        element: <ModalEliminarAplicativo />,
        loader: AplicativoLoader,
      },
    ],
  },
  // Colaboradores
  {
    path: "colaboradores",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <ColaboradoresPage />,
      },
      {
        path: "agregar",
        element: <AgregarColaboradorPage />,
      },
      {
        path: "editar/:id",
        element: <EditarColaboradorPage />,
        loader: ColaboradorLoader,
        shouldRevalidate: ({ currentUrl, nextUrl, currentParams, nextParams }) => {
          // Evita recargar el colaborador cuando solo cambia el query param `q`
          // usado por el buscador lateral dentro del editor.
          const sameUser = currentParams.id === nextParams.id;
          const samePath = currentUrl.pathname === nextUrl.pathname;
          if (sameUser && samePath) return false;
          return true;
        },
      },
    ],
  },
];
