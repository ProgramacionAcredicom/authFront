/**
 * Interfaces para el flujo de autenticación MFA (Multi-Factor Authentication)
 */

export interface MFALoginRequest {
  username: string;
  password: string;
  otp_code?: string;
}

export interface MFAVerifyResponse {
  valid: boolean;
  message: string;
}

export interface MFAStatusResponse {
  user_id: number;
  mfa_enabled: boolean;
  mfa_method: string | null;
}

export interface PendingCredentials {
  username: string;
  password: string;
  timestamp: number; // Para timeout de seguridad
}
