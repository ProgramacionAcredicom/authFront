import { useEffect, useMemo, useState } from "react";
import { useInfiniteColaboradores } from "@/hooks/colaboradores/useInfiniteColaboradores";
import { Result as ColaboradorResult } from "@/interfaces/colaboradores.interfaces";
import { useInView } from "react-intersection-observer";
import { useUserSelection } from "./hooks/useUserSelection";
import { UserSelectorPopover } from "./components/UserSelectorPopover";
import { SelectedUsersList } from "./components/SelectedUsersList";

interface SelectUsuariosGrupoProps {
  selectedUsers: ColaboradorResult[];
  setSelectedUsers: (users: ColaboradorResult[]) => void;
  userIds?: number[];
  initialUsers?: ColaboradorResult[];
  hideFilters?: boolean;
}

export const SelectUsuariosGrupo = ({ selectedUsers, setSelectedUsers, userIds, initialUsers, hideFilters = false }: SelectUsuariosGrupoProps) => {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [filterAgencia, setFilterAgencia] = useState<string>("all");
  const [filterPuesto, setFilterPuesto] = useState<string>("all");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteColaboradores(searchFilter, {
    agencia: filterAgencia,
    puesto: filterPuesto,
  });

  const { ref, inView } = useInView();

  // Scroll infinito
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Obtener todos los usuarios de todas las páginas
  const allUsers = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data]);

  // Filtrar usuarios por agencia y puesto localmente
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    if (filterAgencia && filterAgencia !== "all") {
      filtered = filtered.filter((user) => user.agency?.id.toString() === filterAgencia);
    }

    if (filterPuesto && filterPuesto !== "all") {
      filtered = filtered.filter((user) => user.role?.id.toString() === filterPuesto);
    }

    return filtered;
  }, [allUsers, filterAgencia, filterPuesto]);

  // Hook para manejar la selección de usuarios
  const { isUserSelected, handleUserToggle, removeUser } = useUserSelection({
    selectedUsers,
    setSelectedUsers,
    userIds,
    initialUsers,
    allUsers,
  });

  const selectedUserIds = useMemo(() => selectedUsers.map((u) => u.id), [selectedUsers]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 justify-between">
        <UserSelectorPopover
          selectedUsers={selectedUsers}
          searchFilter={searchFilter}
          onSearchChange={setSearchFilter}
          filterAgencia={filterAgencia}
          filterPuesto={filterPuesto}
          onAgenciaChange={setFilterAgencia}
          onPuestoChange={setFilterPuesto}
          filteredUsers={filteredUsers}
          selectedUserIds={selectedUserIds}
          onUserToggle={handleUserToggle}
          isFetchingNextPage={isFetchingNextPage}
          scrollRef={ref}
          hideFilters={hideFilters}
        />
      </div>
      <div className="flex min-h-32 max-h-64 flex-col gap-3 overflow-y-auto rounded-3xl border border-neutral-200 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 shadow-sm">
        <SelectedUsersList users={selectedUsers} onRemoveUser={removeUser} />
      </div>
    </div>
  );
};

