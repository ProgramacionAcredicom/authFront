import axios from "axios";
import { env } from "@/config/env";
import { MFALoginRequest, MFAVerifyResponse, MFAStatusResponse } from "@/interfaces/auth/mfa.interfaces";

/**
 * Servicios para autenticación MFA
 */

/**
 * Realiza login con código MFA
 * @param credentials Credenciales de usuario incluyendo código OTP
 * @returns Tokens de acceso y refresh
 */
export const loginWithMFA = async (
  credentials: MFALoginRequest
): Promise<{ access: string; refresh: string }> => {
  const response = await axios.post(`${env.VITE_HOST_AUTH_DEV}/api/v1/login/`, credentials);
  return {
    ...response.data,
  };
};

/**
 * Verifica código MFA independientemente (requiere App-Key, para endpoints externos)
 * @param user_id ID del usuario
 * @param otp_code Código OTP a verificar
 * @returns Respuesta de verificación
 */
export const verifyMFACode = async (
  user_id: number,
  otp_code: string
): Promise<MFAVerifyResponse> => {
  // Nota: Este endpoint requiere App-Key, por lo que solo está disponible
  // para aplicaciones externas. Para el login interno, usar loginWithMFA
  const response = await axios.post(
    `${env.VITE_HOST_AUTH_DEV}/api/v1/auth/mfa/verify/`,
    { user_id, otp_code },
    {
      headers: {
        "App-Key": env.VITE_APP_KEY || "", // Requiere configuración de App-Key
      },
    }
  );
  return response.data;
};

/**
 * Verifica el estado MFA de un usuario (requiere App-Key)
 * @param user_id ID del usuario
 * @returns Estado MFA del usuario
 */
export const checkMFAStatus = async (user_id: number): Promise<MFAStatusResponse> => {
  const response = await axios.get(
    `${env.VITE_HOST_AUTH_DEV}/api/v1/auth/mfa/status/${user_id}/`,
    {
      headers: {
        "App-Key": env.VITE_APP_KEY || "", // Requiere configuración de App-Key
      },
    }
  );
  return response.data;
};
