import { useAuthStore } from "@/store/useAuth.store";
import axios, { AxiosError } from "axios";
import { refreshToken } from "./auth/auth.services";

const { VITE_HOST_AUTH_DEV } = import.meta.env;

if (!VITE_HOST_AUTH_DEV) {
  throw new Error("VITE_HOST_AUTH_DEV environment variable is not defined");
}

const apiServices = axios.create({
  baseURL: `${VITE_HOST_AUTH_DEV}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requests
apiServices.interceptors.request.use((config) => {
  const authStore = useAuthStore.getState();
  if (authStore.access) {
    config.headers.Authorization = `Bearer ${authStore.access}`;
  }
  return config;
});

// Interceptor para manejar errores de Axios
apiServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore.getState();
    if (error.response?.data?.error?.includes("La sesión ha expirado o no es válida.")) {
      try {
        const newAccessToken = await refreshToken({ refresh: authStore.refresh! });
        authStore.setAccessToken(newAccessToken.access);
        apiServices.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken.access}`;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.data?.error?.includes("No hay sesión activa para este usuario.")) {
            authStore.logout();
          }
        }
      }
    } else if (error.response?.status === 401) {
      authStore.logout();
    }
    return Promise.reject(error);
  },
);

export default apiServices;
