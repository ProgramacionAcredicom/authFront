import { getAllRoles } from "@/services/roles/roles.services";
import { useQuery } from "@tanstack/react-query";

export const useQueryRoles = () => {
  const queryRoles = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });
  return {
    queryRoles,
  };
};
