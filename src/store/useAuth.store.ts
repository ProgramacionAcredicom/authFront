import { login, MFARequiredError } from "@/services/auth/auth.services";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { queryClient } from "@/lib/react-query";
import { logger } from "@/lib/logger";
import { PendingCredentials } from "@/interfaces/auth/mfa.interfaces";

/**
 * Store de autenticación
 * 
 * NOTA DE SEGURIDAD:
 * Los tokens JWT se almacenan en localStorage mediante zustand/persist.
 * 
 * Consideraciones de seguridad:
 * - localStorage es vulnerable a ataques XSS si hay código malicioso ejecutándose
 * - Los tokens tienen tiempo de expiración limitado (access token corto, refresh token más largo)
 * - Alternativa más segura: usar httpOnly cookies (requiere cambios en backend)
 * 
 * Medidas de mitigación implementadas:
 * - Validación de tokens en el interceptor de Axios
 * - Refresh automático de tokens antes de expirar
 * - Logout automático en caso de token inválido
 * - Limpieza de tokens al hacer logout
 */
interface AuthStoreProps {
  access: null | string;
  refresh: null | string;
  isAuthenticated: boolean;
  pendingCredentials: PendingCredentials | null;
}

interface AuthActionsProps {
  login: (credentials: { username: string; password: string; aplicativo_id?: number; otp_code?: string }) => Promise<void>;
  loginWithMFA: (otp_code: string) => Promise<void>;
  setPendingCredentials: (username: string, password: string) => void;
  clearPendingCredentials: () => void;
  logout: () => void;
  setAccessToken: (access: string) => void;
  getPendingCredentialsTimeRemaining: () => number | null;
  arePendingCredentialsExpired: () => boolean;
}

// Timeout para credenciales temporales (5 minutos)
const PENDING_CREDENTIALS_TIMEOUT = 5 * 60 * 1000;

const AuthStoreInit: AuthStoreProps = {
  access: null,
  refresh: null,
  isAuthenticated: false,
  pendingCredentials: null,
};

const authStore: StateCreator<AuthStoreProps & AuthActionsProps> = (set, get) => ({
  ...AuthStoreInit,
  login: async (credentials) => {
    const loginPromise = login(credentials)
      .then((res) => {
        // Limpiar credenciales temporales después de login exitoso
        set({
          access: res.access,
          refresh: res.refresh,
          isAuthenticated: true,
          pendingCredentials: null,
        });
        queryClient.removeQueries({ queryKey: ["info_user"] });
      })
      .catch((error) => {
        // Si es error de MFA requerido, no mostrar toast de error aquí
        // El componente de login manejará la redirección
        if (error instanceof MFARequiredError) {
          throw error;
        }
        if (error instanceof AxiosError) {
          throw error.response?.data;
        }
        throw error;
      });

    toast.promise(loginPromise, {
      loading: "Iniciando sesión...",
      success: () => {
        return `¡Bienvenido!`;
      },
      error: (data) => {
        // No mostrar error si es MFA requerido (se maneja en el componente)
        if (data instanceof MFARequiredError) {
          return "";
        }
        logger.errorWithContext("Error al iniciar sesión", data);
        return data?.error || "Error al iniciar sesión.";
      },
      position: "bottom-right",
    });
    return loginPromise;
  },

  loginWithMFA: async (otp_code: string) => {
    const state = get();
    if (!state.pendingCredentials) {
      throw new Error("No hay credenciales pendientes. Por favor, inicie sesión nuevamente.");
    }

    // Verificar timeout de credenciales
    const now = Date.now();
    if (now - state.pendingCredentials.timestamp > PENDING_CREDENTIALS_TIMEOUT) {
      set({ pendingCredentials: null });
      throw new Error("Las credenciales han expirado. Por favor, inicie sesión nuevamente.");
    }

    const loginPromise = login({
      username: state.pendingCredentials.username,
      password: state.pendingCredentials.password,
      otp_code,
    })
      .then((res) => {
        // Limpiar credenciales temporales después de login exitoso
        set({
          access: res.access,
          refresh: res.refresh,
          isAuthenticated: true,
          pendingCredentials: null,
        });
        queryClient.removeQueries({ queryKey: ["info_user"] });
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          throw error.response?.data;
        }
        throw error;
      });

    toast.promise(loginPromise, {
      loading: "Verificando código...",
      success: () => {
        return `¡Bienvenido!`;
      },
      error: (data) => {
        logger.errorWithContext("Error al verificar código MFA", data);
        return data?.error || data?.detail || "Código de verificación inválido. Por favor, intente nuevamente.";
      },
      position: "bottom-right",
    });
    return loginPromise;
  },

  setPendingCredentials: (username: string, password: string) => {
    set({
      pendingCredentials: {
        username,
        password,
        timestamp: Date.now(),
      },
    });
  },

  clearPendingCredentials: () => {
    set({ pendingCredentials: null });
  },

  logout: () => {
    // Limpiar tokens y credenciales temporales
    set({ ...AuthStoreInit });
    queryClient.clear();
  },
  setAccessToken: (access) => set({ access }),
  
  getPendingCredentialsTimeRemaining: () => {
    const state = get();
    if (!state.pendingCredentials) {
      return null;
    }
    const elapsed = Date.now() - state.pendingCredentials.timestamp;
    const remaining = PENDING_CREDENTIALS_TIMEOUT - elapsed;
    return Math.max(0, remaining);
  },
  
  arePendingCredentialsExpired: () => {
    const state = get();
    if (!state.pendingCredentials) {
      return true;
    }
    const elapsed = Date.now() - state.pendingCredentials.timestamp;
    return elapsed > PENDING_CREDENTIALS_TIMEOUT;
  },
});

export const useAuthStore = create(
  persist(authStore, {
    name: "auth-storage",
    partialize: (state) => ({
      access: state.access,
      refresh: state.refresh,
      isAuthenticated: state.isAuthenticated,
      // NO persistir credenciales temporales por seguridad
    }),
  }),
);
