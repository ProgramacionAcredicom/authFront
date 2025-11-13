import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import AuthLayout from "@/app/auth/layout";
import { GuestRoute } from "@/components/protected-route/GuestRoute";

// Lazy load de páginas de autenticación
const LoginPage = lazy(() => import("@/app/auth/login/page").then((m) => ({ default: m.default })));
const ForgotPasswordPage = lazy(() => import("@/app/auth/forgot-password/page").then((m) => ({ default: m.default })));
const CodeOtpPage = lazy(() => import("@/app/auth/code-otp/page").then((m) => ({ default: m.default })));

/**
 * Rutas de autenticación (solo para invitados)
 */
export const authRoutes: RouteObject[] = [
  {
    element: <GuestRoute />,
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
];

