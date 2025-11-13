/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base del servidor de autenticación (requerido) */
  readonly VITE_HOST_AUTH_DEV: string;
  /** ID del aplicativo (requerido) */
  readonly VITE_APLICATIVO_ID: string;
  /** URL de redirección después del restablecimiento de contraseña (opcional) */
  readonly VITE_PASSWORD_RESET_REDIRECT_URL?: string;
  /** Nombre de la aplicación (opcional) */
  readonly VITE_APP_NAME?: string;
  /** URL base de la API (opcional) */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}