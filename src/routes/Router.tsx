import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "@/app/admin/layout";
import AdminPage from "@/app/admin/page";
import AuthLayout from "@/app/auth/layout";
import LoginPage from "@/app/auth/login/page";
import { ProtectedRoute } from "@/components/protected-route/ProtectedRoute";
import { GuestRoute } from "@/components/protected-route/GuestRoute";
import { ColaboradoresPage } from "@/app/admin/colaboradores/page";
import { AgenciasPage } from "@/app/admin/agencias/page";
import { GruposPage } from "@/app/admin/grupos-permisos/grupos-y-permisos/page";
import { AplicativosPage } from "@/app/admin/grupos-permisos/aplicativos/page";
import ForgotPasswordPage from "@/app/auth/forgot-password/page";
import CodeOtpPage from "@/app/auth/code-otp/page";
import Page404 from "@/app/404/page404";
import { ColaboradorLoader } from "@/app/admin/colaboradores/editarColaborador/loader";
import { AgregarColaboradorPage } from "@/app/admin/colaboradores/agregarColaborador/page";
import { EditarColaboradorPage } from "@/app/admin/colaboradores/editarColaborador/page";
import { ModalAsignarAplicativo } from "@/components/modal/aplicativos/modal-asignar-aplicativo";
import { AplicativoLoader } from "@/app/admin/grupos-permisos/aplicativos/loader";
import { ModalEliminarAplicativo } from "@/components/modal/aplicativos/modal-eliminar-aplicativo";
import { PermisoLoader } from "@/app/admin/grupos-permisos/grupos-y-permisos/loaderPermiso";
import { ModalEditarPermiso } from "@/components/modal/permisos/modal-editar-permiso";
import { ModalEliminarPermiso } from "@/components/modal/permisos/modal-eliminar-permiso";
import { ModalEditarGrupo } from "@/components/modal/grupos/modal-editar-grupo";
import { ModalEliminarGrupo } from "@/components/modal/grupos/modal-eliminar-grupo";
import { GrupoLoader } from "@/app/admin/grupos-permisos/grupos-y-permisos/loaderGrupo";

const routes = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    errorElement: <Page404 />,
    children: [
      {
        path: "/",
        element: <LayoutAdmin />,
        children: [
          {
            index: true,
            element: <AdminPage />,
          },
          // Agencias
          {
            path: "agencias/agencias",
            element: <AgenciasPage />,
          },
          // Grupos y permisos
          // {
          //   path: "grupos-permisos/agregar",
          //   element: <GruposPage />,
          // },
          // {
          //   path: "grupos-permisos/aplicativos",
          //   element: <AplicativosPage />,
          // },
        ],
      },
      // Grupos y permisos
      {
        path: "grupos-permisos",
        element: <LayoutAdmin />,
        children: [
          {
            path: "grupos",
            element: <GruposPage />,
            children: [
              {
                path: "permisos/editar/:id",
                element: <ModalEditarPermiso />,
                loader: PermisoLoader,
              },
              {
                path: "permisos/eliminar/:id",
                element: <ModalEliminarPermiso />,
                loader: PermisoLoader,
              },
              {
                path: "editar/:id",
                element: <ModalEditarGrupo />,
                loader: GrupoLoader,
              },
              {
                path: "eliminar/:id",
                element: <ModalEliminarGrupo />,
                loader: GrupoLoader,
              },
            ],
          },
          {
            path: "aplicativos",
            element: <AplicativosPage />,
            children: [
              { path: "nuevo", element: <ModalAsignarAplicativo /> },
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
          },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />, // Todas las rutas hijas serán accesibles solo para invitados
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "code-otp",
            element: <CodeOtpPage />,
          },
        ],
      },
    ],
  },
]);

export const RouterApp = () => <RouterProvider router={routes} />;
