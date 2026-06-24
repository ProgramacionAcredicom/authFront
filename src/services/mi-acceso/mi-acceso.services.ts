import apiServices from "@/services/configAxios";
import type {
  AccessRequestDetailApi,
  AccessRequestListResponse,
  AccessSystemListResponse,
  CreateAccessRequestPayload,
  GetAccessSystemsParams,
  GetAdminMiAccesoRequestsParams,
  GetMiAccesoRequestsParams,
  UpdateAccessRequestStatusPayload,
} from "@/interfaces/mi-acceso.interfaces";

export const getMiAccesoRequests = async (params: GetMiAccesoRequestsParams): Promise<AccessRequestListResponse> => {
  const response = await apiServices.get<AccessRequestListResponse>("/solicitudes/", { params });
  return response.data;
};

export const getAdminMiAccesoRequests = async (params: GetAdminMiAccesoRequestsParams): Promise<AccessRequestListResponse> => {
  const response = await apiServices.get<AccessRequestListResponse>("/solicitudes/admin/", { params });
  return response.data;
};

export const getMiAccesoRequestById = async (id: number): Promise<AccessRequestDetailApi> => {
  const response = await apiServices.get<AccessRequestDetailApi>(`/solicitudes/${id}/`);
  return response.data;
};

export const getAccessSystems = async (params: GetAccessSystemsParams): Promise<AccessSystemListResponse> => {
  const response = await apiServices.get<AccessSystemListResponse>("/sistemas-acceso/", { params });
  return response.data;
};

export const createMiAccesoRequest = async (payload: CreateAccessRequestPayload): Promise<AccessRequestDetailApi> => {
  const response = await apiServices.post<AccessRequestDetailApi>("/solicitudes/", payload);
  return response.data;
};

export const updateMiAccesoRequestStatus = async (
  id: number,
  payload: UpdateAccessRequestStatusPayload,
): Promise<AccessRequestDetailApi> => {
  const response = await apiServices.patch<AccessRequestDetailApi>(`/solicitudes/${id}/`, payload);
  return response.data;
};

export const downloadMiAccesoRequestPdf = async (id: number) => {
  const response = await apiServices.get<Blob>(`/solicitudes/${id}/pdf/`, {
    responseType: "blob",
  });

  return {
    blob: response.data,
    contentDisposition: response.headers["content-disposition"],
  };
};
