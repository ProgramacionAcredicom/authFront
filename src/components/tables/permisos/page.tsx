import { useQueryPermisos } from "@/hooks/permisos/useQueryPermisos";
import { columns } from "./columns";
import { PermisosTable } from "./data-table";

export default function PermisosTablePage() {
  const { queryPermisos } = useQueryPermisos();
  
  const data = queryPermisos.data?.results || [];
  const totalItems = queryPermisos.data?.total || 0;
  
  return (
    <PermisosTable 
      data={data} 
      totalItems={totalItems} 
      columns={columns} 
      isLoading={queryPermisos.isLoading} 
    />
  );
}

