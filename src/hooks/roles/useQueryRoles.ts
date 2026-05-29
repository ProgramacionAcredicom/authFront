import { getAllRoles } from "@/services/roles/roles.services";
import { useQuery } from "@tanstack/react-query";

interface UseQueryRolesOptions {
  enabled?: boolean;
}

export const useQueryRoles = (options?: UseQueryRolesOptions) => {
  const queryRoles = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
    enabled: options?.enabled ?? true,
  });
  return {
    queryRoles,
  };
};
