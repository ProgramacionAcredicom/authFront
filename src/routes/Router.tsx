import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Wrapper para Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

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
            element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
          },
        ],
      },
      ...adminRoutes.map((route) => ({
        ...route,
        element: route.element ? <SuspenseWrapper>{route.element}</SuspenseWrapper> : route.element,
        children: route.children?.map((child) => ({
          ...child,
          element: child.element ? <SuspenseWrapper>{child.element}</SuspenseWrapper> : child.element,
          children: child.children?.map((grandchild) => ({
            ...grandchild,
            element: grandchild.element ? <SuspenseWrapper>{grandchild.element}</SuspenseWrapper> : grandchild.element,
          })),
        })),
      })),
    ],
  },
  ...authRoutes.map((route) => ({
    ...route,
    element: route.element ? <SuspenseWrapper>{route.element}</SuspenseWrapper> : route.element,
    children: route.children?.map((child) => ({
      ...child,
      element: child.element ? <SuspenseWrapper>{child.element}</SuspenseWrapper> : child.element,
      children: child.children?.map((grandchild) => ({
        ...grandchild,
        element: grandchild.element ? <SuspenseWrapper>{grandchild.element}</SuspenseWrapper> : grandchild.element,
      })),
    })),
  })),
]);

export const RouterApp = () => <RouterProvider router={routes} />;
