import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/services/auth/auth.services";
import { useAuthStore } from "@/store/useAuth.store";
import type { OAuthPermission } from "@/lib/permissions";
import { hasAccess } from "@/lib/permissions";

interface UsePermissionAccessOptions {
  enabled?: boolean;
}

export const useInfoUserQuery = (options?: UsePermissionAccessOptions) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isEnabled = options?.enabled ?? isAuthenticated;

  return useQuery({
    queryKey: ["info_user"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 60,
    retry: false,
    enabled: isEnabled,
  });
};

export const useHasPermission = (permission: OAuthPermission, options?: UsePermissionAccessOptions) => {
  const query = useInfoUserQuery(options);

  return {
    ...query,
    hasPermission: hasAccess(query.data, permission),
  };
};
