/**
 * Interfaces para el flujo de autenticación MFA (Multi-Factor Authentication)
 */

export type MFAMethod = 'totp' | 'email';

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

export interface MFAConfig {
  method: MFAMethod;
  enabled: boolean;
  email?: string;
}

export interface EmailMFASetupResponse {
  detail: string;
  method: 'email';
  email: string;
  message: string;
}

export interface TOTPMFASetupResponse {
  detail: string;
  method: 'totp';
  otp_url: string;
  qr_image_base64: string;
  backup_codes: string[];
  message: string;
}

export type MFASetupResponse = EmailMFASetupResponse | TOTPMFASetupResponse;
