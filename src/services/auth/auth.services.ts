import axios from "axios";
import apiServices from "../configAxios";
import { localPerfilUsuarioMapper } from "@/mappers/local-perfilUsuario.mapper";
import { env } from "@/config/env";
import { StatisticsResponse } from "@/interfaces/statistics.interfaces";

export const login = async (credentials: { username: string; password: string }): Promise<{ access: string; refresh: string }> => {
  const response = await axios.post(`${env.VITE_HOST_AUTH_DEV}/api/v1/login/`, credentials);
  return {
    ...response.data,
  };
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
