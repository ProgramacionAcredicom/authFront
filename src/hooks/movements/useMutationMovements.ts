import { useMutation } from "@tanstack/react-query";

import { createMovements } from "@/services/movements/movements.services";

export const useMutationCreateMovements = () => {
  const mutation = useMutation({
    mutationFn: createMovements,
  });

  return {
    mutation,
    isLoading: mutation.isPending,
  };
};
