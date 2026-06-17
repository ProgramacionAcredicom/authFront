import { PAGINATION } from "@/config/constants";
import type { AuditLogApi, AuditLogFilters, AuditLogListApi } from "@/interfaces/auditoria.interfaces";
import { localAuditLogMapper } from "@/mappers/local-auditoria.mapper";
import apiServices from "@/services/configAxios";

function normalizeAuditLogResponse(data: AuditLogApi[] | AuditLogListApi) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}

export const getAuditLogs = async (filters: AuditLogFilters) => {
  const response = await apiServices.get<AuditLogApi[] | AuditLogListApi>("/auditoria/", {
    params: {
      fecha_inicio: filters.fecha_inicio,
      fecha_fin: filters.fecha_fin,
      page: 1,
      page_size: PAGINATION.MAX_PAGE_SIZE,
    },
  });

  return normalizeAuditLogResponse(response.data).map(localAuditLogMapper);
};
