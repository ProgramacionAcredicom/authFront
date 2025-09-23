// Configuración de variables de entorno
export const environment = {
  // Ruta de redirección después del restablecimiento de contraseña
  passwordResetRedirectUrl: import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL || "/auth/login",
  
  // Otras configuraciones de la aplicación
  appName: import.meta.env.VITE_APP_NAME || "Acredicom Auth",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
} as const;
