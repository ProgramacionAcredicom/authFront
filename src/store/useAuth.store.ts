import { login, logout } from "@/services/auth/auth.services";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { queryClient } from "@/lib/react-query";
import { logger } from "@/lib/logger";
interface AuthStoreProps {
  access: null | string;
  refresh: null | string;
  isAuthenticated: boolean;
}

interface AuthActionsProps {
  login: (credentials: { username: string; password: string; aplicativo_id?: number }) => Promise<void>;
  logout: () => void;
  setAccessToken: (access: string) => void;
}

const AuthStoreInit: AuthStoreProps = {
  access: null,
  refresh: null,
  isAuthenticated: false,
};

const authStore: StateCreator<AuthStoreProps & AuthActionsProps> = (set, get) => ({
  ...AuthStoreInit,
  login: async (credentials) => {
    const loginPromise = login(credentials)
      .then((res) => {
        set({
          access: res.access,
          refresh: res.refresh,
          isAuthenticated: true,
        });
        queryClient.removeQueries({ queryKey: ["info_user"] });
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          throw error.response?.data;
        }
      });

    toast.promise(loginPromise, {
      loading: "Iniciando sesión...",
      success: () => {
        return `¡Bienvenido!`;
      },
      error: (data) => {
        logger.errorWithContext("Error al iniciar sesión", data);
        return data?.error || "Error al iniciar sesión.";
      },
      position: "bottom-right",
    });
    return loginPromise;
  },

  logout: async () => {
    try {
      await logout({ refresh: get().refresh });
      set({ ...AuthStoreInit });
    } catch (error) {
      set({ ...AuthStoreInit });
      throw error;
    } finally {
      queryClient.clear();
    }
  },
  setAccessToken: (access) => set({ access }),
});

export const useAuthStore = create(
  persist(authStore, {
    name: "auth-storage",
    partialize: (state) => ({
      access: state.access,
      refresh: state.refresh,
      isAuthenticated: state.isAuthenticated,
    }),
  }),
);
