import { useQuery } from "@tanstack/react-query";

import type { AuditLogFilters } from "@/interfaces/auditoria.interfaces";
import { getAuditLogs } from "@/services/auditoria/auditoria.services";

export const useQueryAuditoria = (filters: AuditLogFilters, enabled = true) => {
  return useQuery({
    queryKey: ["auditoria", filters],
    queryFn: () => getAuditLogs(filters),
    enabled,
  });
};
