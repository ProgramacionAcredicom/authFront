import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/protected-route/ProtectedRoute";
import Page404 from "@/app/404/page404";
import LayoutAdmin from "@/app/admin/layout";
import { adminRoutes } from "./admin.routes";
import { authRoutes } from "./auth.routes";
import { Loader2 } from "lucide-react";

// Lazy load de página de perfil
const ProfilePage = lazy(() => import("@/app/profile/page").then((m) => ({ default: m.default })));

// Componente de carga para lazy loading
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="text-primary h-8 w-8 animate-spin" />
  </div>
);

// Wrapper para Suspense
const SuspenseWrapper = ({ children }: { children: ReactNode }) => <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;

const wrapRouteElement = (element: RouteObject["element"]) => {
  if (element == null) return element;
  return <SuspenseWrapper>{element}</SuspenseWrapper>;
};

const withSuspense = (route: RouteObject): RouteObject => {
  if (route.index) {
    return {
      ...route,
      element: wrapRouteElement(route.element),
    };
  }

  return {
    ...route,
    element: wrapRouteElement(route.element),
    children: route.children?.map(withSuspense),
  };
};

const routes = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    errorElement: <Page404 />,
    children: [
      // Ruta de perfil accesible para todos los usuarios autenticados
      {
        path: "profile",
        element: <LayoutAdmin />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      ...adminRoutes.map(withSuspense),
    ],
  },
  ...authRoutes.map(withSuspense),
]);

export const RouterApp = () => <RouterProvider router={routes} />;
