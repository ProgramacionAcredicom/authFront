import { useEffect, useRef } from "react";
import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";
import { toast } from "sonner";

interface UseUserSelectionProps {
  selectedUsers: ColaboradorResult[];
  setSelectedUsers: (users: ColaboradorResult[]) => void;
  userIds?: number[];
  initialUsers?: ColaboradorResult[];
  allUsers: ColaboradorResult[];
}

/**
 * Hook personalizado para manejar la lógica de selección de usuarios
 */
export function useUserSelection({
  selectedUsers,
  setSelectedUsers,
  userIds,
  initialUsers,
  allUsers,
}: UseUserSelectionProps) {
  const initializedRef = useRef(false);
  const previousUserIdsRef = useRef<number[] | undefined>(undefined);
  const userHasModifiedRef = useRef(false);

  // Verificar si un usuario está seleccionado
  const isUserSelected = (userId: number) => {
    return selectedUsers.some((u) => u.id === userId);
  };

  // Manejar toggle de selección de usuario
  const handleUserToggle = (user: ColaboradorResult, isMultiSelect: boolean, closePopover?: () => void) => {
    userHasModifiedRef.current = true;

    const isSelected = isUserSelected(user.id);

    if (isSelected) {
      const newUsers = selectedUsers.filter((u) => u.id !== user.id);
      setSelectedUsers(newUsers);
      toast.success(`Usuario "${user.name}" eliminado`, {
        duration: 2000,
      });
      if (!isMultiSelect && closePopover) {
        closePopover();
      }
    } else {
      const newUsers = [...selectedUsers, user];
      setSelectedUsers(newUsers);
      toast.success(`Usuario "${user.name}" agregado`, {
        duration: 2000,
      });
      if (!isMultiSelect && closePopover) {
        closePopover();
      }
    }
  };

  // Remover usuario de la selección
  const removeUser = (userId: number) => {
    userHasModifiedRef.current = true;
    const user = selectedUsers.find((u) => u.id === userId);
    const newUsers = selectedUsers.filter((u) => u.id !== userId);
    setSelectedUsers(newUsers);
    if (user) {
      toast.success(`Usuario "${user.name}" eliminado`, {
        duration: 2000,
      });
    }
  };

  // Inicializar usuarios seleccionados desde userIds o initialUsers
  useEffect(() => {
    if (userHasModifiedRef.current && initializedRef.current) {
      return;
    }

    const userIdsString = JSON.stringify(userIds?.sort() || []);
    const previousUserIdsString = JSON.stringify(previousUserIdsRef.current?.sort() || []);
    const userIdsChanged = userIdsString !== previousUserIdsString;

    if (!userIdsChanged && initializedRef.current) {
      return;
    }

    if (!userIds || userIds.length === 0) {
      if (userIdsChanged) {
        setSelectedUsers([]);
      }
      previousUserIdsRef.current = userIds;
      initializedRef.current = true;
      return;
    }

    // Priorizar initialUsers si están disponibles
    if (initialUsers && initialUsers.length > 0) {
      if (userIdsChanged || !initializedRef.current) {
        const initialSelected = initialUsers.filter((u) => userIds.includes(u.id));
        if (userIdsChanged) {
          setSelectedUsers(initialSelected);
          userHasModifiedRef.current = false;
        } else if (!initializedRef.current && !userHasModifiedRef.current) {
          setSelectedUsers(initialSelected);
        }
        initializedRef.current = true;
      }
      previousUserIdsRef.current = userIds;
    } else if (allUsers.length > 0) {
      // Fallback: buscar en allUsers
      if (userIdsChanged || !initializedRef.current) {
        const initialSelected = allUsers.filter((u) => userIds.includes(u.id));
        if (userIdsChanged) {
          setSelectedUsers(initialSelected);
          userHasModifiedRef.current = false;
        } else if (!initializedRef.current && !userHasModifiedRef.current) {
          setSelectedUsers(initialSelected);
        }
        initializedRef.current = true;
      }
      previousUserIdsRef.current = userIds;
    }
  }, [userIds, allUsers, initialUsers, setSelectedUsers]);

  return {
    isUserSelected,
    handleUserToggle,
    removeUser,
  };
}

