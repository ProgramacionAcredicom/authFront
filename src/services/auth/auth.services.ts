import axios, { AxiosError } from "axios";
import apiServices from "../configAxios";
import { localPerfilUsuarioMapper } from "@/mappers/local-perfilUsuario.mapper";
import { env } from "@/config/env";
import { StatisticsResponse } from "@/interfaces/statistics.interfaces";

/**
 * Error personalizado para cuando MFA es requerido
 */
export class MFARequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MFARequiredError";
  }
}

/**
 * Verifica si un error de Axios es un error de MFA requerido
 */
export const isMFARequiredError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.detail || error.response?.data?.error || "";
    return (
      typeof errorMessage === "string" &&
      (errorMessage.includes("MFA está habilitado") ||
        errorMessage.includes("MFA requerido") ||
        errorMessage.includes("código de verificación"))
    );
  }
  return false;
};

/**
 * Obtiene el mensaje de error de MFA requerido
 */
export const getMFARequiredMessage = (error: unknown): string | null => {
  if (isMFARequiredError(error)) {
    if (error instanceof AxiosError) {
      return (
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "MFA está habilitado. Por favor, proporcione el código de verificación."
      );
    }
  }
  return null;
};

export const login = async (credentials: {
  username: string;
  password: string;
  otp_code?: string;
}): Promise<{ access: string; refresh: string }> => {
  try {
    const response = await axios.post(`${env.VITE_HOST_AUTH_DEV}/api/v1/login/`, credentials);
    return {
      ...response.data,
    };
  } catch (error) {
    // Si es un error de MFA requerido, lanzar error personalizado
    if (isMFARequiredError(error)) {
      const message = getMFARequiredMessage(error) || "MFA está habilitado. Por favor, proporcione el código de verificación.";
      throw new MFARequiredError(message);
    }
    // Re-lanzar otros errores
    throw error;
  }
};

export const logout = async (refresh: { refresh: string | null }) => {
  const response = await apiServices.post(`/auth/logout/`, refresh);
  return response.data;
};

export const refreshToken = async ({ refresh }: { refresh: string }) => {
  const response = await apiServices.post(`${env.VITE_HOST_AUTH_DEV}/api/v1/token/refresh/`, { refresh });
  return response.data;
};

export const getProfile = async () => {
  const response = await apiServices.post("/api/v1/info/");
  const perfilUsuario = localPerfilUsuarioMapper(response.data);
  return perfilUsuario;
};

export const getProfilePerms = async () => {
  const response = await apiServices.get("/users/get-my-perms/");
  return response.data;
};

export const forgotPassword = async (username_or_email: string) => {
  const response = await axios.post(`${env.VITE_HOST_AUTH_DEV}/auth/password-recovery/`, { username_or_email });
  return response.data;
};

export const verifyOTP = async (email: string, otp_code: string, new_password: string) => {
  const response = await axios.post(`${env.VITE_HOST_AUTH_DEV}/auth/reset-password-otp/`, { email, otp_code, new_password });
  return response.data;
};

export const generatePassword = async (id: string | number) => {
  const response = await apiServices.post(`/auth/password/generate/${id}/`);
  return response.data;
};

export const getStatistics = async (): Promise<StatisticsResponse> => {
  const response = await apiServices.get("/statistics/");
  return response.data;
};

/**
 * Habilita MFA (Multi-Factor Authentication) para el usuario autenticado
 * @param method Método MFA a habilitar: 'totp' para app autenticadora, 'email' para correo electrónico
 * @returns Datos de configuración MFA según el método seleccionado
 */
export const enableMFA = async (method: 'totp' | 'email' = 'totp'): Promise<{
  detail: string;
  method: 'totp' | 'email';
  otp_url?: string;
  qr_image_base64?: string;
  backup_codes?: string[];
  email?: string;
  message: string;
}> => {
  const response = await apiServices.post("/user/otp/enable/", { 
    enable_otp: true,
    method 
  });
  return response.data;
};

/**
 * Habilita MFA por email específicamente
 * @returns Datos de configuración MFA por email
 */
export const enableEmailMFA = async (): Promise<{
  detail: string;
  method: 'email';
  email: string;
  message: string;
}> => {
  return enableMFA('email') as Promise<{
    detail: string;
    method: 'email';
    email: string;
    message: string;
  }>;
};

/**
 * Solicita reenvío de código MFA por correo electrónico
 * @returns Mensaje de confirmación
 */
export const sendMFAEmailCode = async (): Promise<{
  detail: string;
  message: string;
}> => {
  const response = await apiServices.post("/user/otp/resend-email-code/");
  return response.data;
};

/**
 * Deshabilita MFA para el usuario autenticado
 * @param otp_code Código OTP válido requerido para deshabilitar MFA
 * @returns Mensaje de confirmación
 */
export const disableMFA = async (otp_code: string): Promise<{ detail: string }> => {
  const response = await apiServices.post("/user/otp/disable/", { otp: otp_code });
  return response.data;
};

/**
 * Actualiza la foto de perfil del usuario autenticado
 * @param file Archivo de imagen a subir
 * @returns Datos actualizados del usuario
 */
export const updateProfilePicture = async (file: File): Promise<{ picture: string }> => {
  const formData = new FormData();
  formData.append("picture", file);

  // No establecer Content-Type manualmente, el navegador lo hará automáticamente con el boundary correcto
  const response = await apiServices.put("/user/profile-picture/update/", formData);
  return response.data;
};
