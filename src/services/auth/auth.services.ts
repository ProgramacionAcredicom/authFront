import axios from "axios";
import apiServices from "../configAxios";
import { localPerfilUsuarioMapper } from "@/mappers/local-perfilUsuario.mapper";
const { VITE_HOST_AUTH_DEV, VITE_APLICATIVO_ID } = import.meta.env;

export const login = async (credentials: { username: string; password: string }): Promise<{ access: string; refresh: string }> => {
  const response = await axios.post(`${VITE_HOST_AUTH_DEV}/auth/login/`, {
    ...credentials,
    aplicativo_id: VITE_APLICATIVO_ID,
  });
  return {
    ...response.data,
  };
};

export const logout = async (refresh: { refresh: string | null }) => {
  const response = await apiServices.post(`/auth/logout/`, refresh);
  return response.data;
};

export const refreshToken = async ({ refresh }: { refresh: string }) => {
  const response = await apiServices.post(`${VITE_HOST_AUTH_DEV}/auth/token/refresh/`, { refresh });
  return response.data;
};

export const getProfile = async () => {
  const response = await apiServices.post("/auth/info/", {
    aplicativo_id: VITE_APLICATIVO_ID,
  });
  const perfilUsuario = localPerfilUsuarioMapper(response.data);
  return perfilUsuario;
};

export const getProfilePerms = async () => {
  const response = await apiServices.get("/users/get-my-perms/");
  return response.data;
};

export const forgotPassword = async (username_or_email: string) => {
  const response = await axios.post(`${VITE_HOST_AUTH_DEV}/auth/password-recovery/`, { username_or_email });
  return response.data;
};

export const verifyOTP = async (email: string, otp_code: string, new_password: string) => {
  const response = await axios.post(`${VITE_HOST_AUTH_DEV}/auth/reset-password-otp/`, { email, otp_code, new_password });
  return response.data;
};

export const generatePassword = async (id: string | number) => {
  const response = await apiServices.post(`/auth/password/generate/${id}/`);
  return response.data;
};
