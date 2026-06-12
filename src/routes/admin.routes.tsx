import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import LayoutAdmin from "@/app/admin/layout";
import { PermissionRoute } from "@/components/protected-route/PermissionRoute";
import { StaffOnly } from "@/components/protected-route/StaffRoute";
import { ColaboradorLoader } from "@/app/admin/colaboradores/editarColaborador/loader";
import { AplicativoLoader } from "@/app/admin/grupos-permisos/aplicativos/loader";
import { PermisoLoader } from "@/app/admin/grupos-permisos/permisos/loader";
import { GrupoLoader, EditarGrupoLoader } from "@/app/admin/grupos-permisos/grupos/loader";
import { OAUTH_PERMISSIONS } from "@/lib/permissions";

// Lazy load de páginas admin
const AdminPage = lazy(() => import("@/app/admin/page").then((m) => ({ default: m.default })));
const MovementRequestsPage = lazy(() => import("@/app/admin/movimientos-registro/page").then((m) => ({ default: m.default })));
const MiAccesoPage = lazy(() => import("@/app/admin/mis-solicitudes/page").then((m) => ({ default: m.default })));
const MiAccesoNewRequestPage = lazy(() => import("@/app/admin/mis-solicitudes/new-request-page").then((m) => ({ default: m.default })));
const MiAccesoAccessRequirementsPage = lazy(
  () => import("@/app/admin/mis-solicitudes/access-requirements-page").then((m) => ({ default: m.default })),
);
const MiAccesoAdministrationPage = lazy(
  () => import("@/app/admin/administracion-solicitudes/page").then((m) => ({ default: m.default })),
);
const AuditoriaPage = lazy(() => import("@/app/admin/auditoria/page").then((m) => ({ default: m.default })));
const MovimientosPage = lazy(() => import("@/app/admin/movimientos-reporteria/page").then((m) => ({ default: m.default })));
const ColaboradoresPage = lazy(() => import("@/app/admin/colaboradores/page").then((m) => ({ default: m.ColaboradoresPage })));
const AgenciasPage = lazy(() => import("@/app/admin/agencias/page").then((m) => ({ default: m.AgenciasPage })));
const AreasPage = lazy(() => import("@/app/admin/areas/page").then((m) => ({ default: m.default })));
const GruposPage = lazy(() => import("@/app/admin/grupos-permisos/grupos/page").then((m) => ({ default: m.GruposPage })));
const PermisosPage = lazy(() => import("@/app/admin/grupos-permisos/permisos/page").then((m) => ({ default: m.default })));
const AplicativosPage = lazy(() => import("@/app/admin/grupos-permisos/aplicativos/page").then((m) => ({ default: m.AplicativosPage })));
const PuestosPage = lazy(() => import("@/app/admin/puestos/page").then((m) => ({ default: m.PuestosPage })));
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
    element: (
      <StaffOnly>
        <LayoutAdmin />
      </StaffOnly>
    ),
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
  {
    path: "movimientos",
    element: (
      <PermissionRoute requiredPermission={OAUTH_PERMISSIONS.MOVEMENTS_ACCESS}>
        <LayoutAdmin />
      </PermissionRoute>
    ),
    children: [
      {
        index: true,
        element: <MovementRequestsPage />,
      },
    ],
  },
  {
    path: "mi-acceso",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <PermissionRoute requiredPermission={OAUTH_PERMISSIONS.ACCESS_MY_REQUESTS}>
            <MiAccesoPage />
          </PermissionRoute>
        ),
      },
      {
        path: "nueva",
        element: (
          <PermissionRoute requiredPermission={OAUTH_PERMISSIONS.CREATE_ACCESS_REQUEST}>
            <MiAccesoNewRequestPage />
          </PermissionRoute>
        ),
      },
      {
        path: "requerimiento-accesos",
        element: (
          <PermissionRoute requiredPermission={OAUTH_PERMISSIONS.CREATE_ACCESS_REQUEST}>
            <MiAccesoAccessRequirementsPage />
          </PermissionRoute>
        ),
      },
      {
        path: "administracion-solicitudes",
        element: (
          <PermissionRoute requiredPermission={OAUTH_PERMISSIONS.MANAGE_ACCESS_REQUESTS}>
            <MiAccesoAdministrationPage />
          </PermissionRoute>
        ),
      },
    ],
  },
  {
    path: "auditoria",
    element: (
      <PermissionRoute requiredPermission={OAUTH_PERMISSIONS.AUDIT_LOG_ACCESS}>
        <LayoutAdmin />
      </PermissionRoute>
    ),
    children: [
      {
        index: true,
        element: <AuditoriaPage />,
      },
    ],
  },
  {
    path: "reporteria",
    element: (
      <PermissionRoute requiredPermission={OAUTH_PERMISSIONS.MOVEMENTS_REPORT_ACCESS}>
        <LayoutAdmin />
      </PermissionRoute>
    ),
    children: [
      {
        index: true,
        element: <MovimientosPage />,
      },
    ],
  },
  // Agencias
  {
    path: "agencias",
    element: (
      <StaffOnly>
        <LayoutAdmin />
      </StaffOnly>
    ),
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
    element: (
      <StaffOnly>
        <LayoutAdmin />
      </StaffOnly>
    ),
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
    element: (
      <StaffOnly>
        <LayoutAdmin />
      </StaffOnly>
    ),
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
    element: (
      <StaffOnly>
        <LayoutAdmin />
      </StaffOnly>
    ),
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
  // Puestos
  {
    path: "puestos",
    element: (
      <PermissionRoute requiredPermission={OAUTH_PERMISSIONS.VIEW_POSITION}>
        <LayoutAdmin />
      </PermissionRoute>
    ),
    children: [
      {
        index: true,
        element: <PuestosPage />,
      },
    ],
  },
  // Aplicativos
  {
    path: "aplicativos",
    element: (
      <StaffOnly>
        <LayoutAdmin />
      </StaffOnly>
    ),
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
    element: (
      <StaffOnly>
        <LayoutAdmin />
      </StaffOnly>
    ),
    children: [
      {
        index: true,
        element: <ColaboradoresPage />,
      },
      {
        path: "agregar",
        element: (
          <StaffOnly>
            <AgregarColaboradorPage />
          </StaffOnly>
        ),
      },
      {
        path: "editar/:id",
        element: (
          <StaffOnly>
            <EditarColaboradorPage />
          </StaffOnly>
        ),
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
