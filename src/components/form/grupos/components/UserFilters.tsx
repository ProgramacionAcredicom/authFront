import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryAgencias } from "@/hooks/agencias/useQueryAgencias";
import { useQueryRoles } from "@/hooks/roles/useQueryRoles";

interface UserFiltersProps {
  filterAgencia: string;
  filterPuesto: string;
  onAgenciaChange: (value: string) => void;
  onPuestoChange: (value: string) => void;
}

/**
 * Componente para los filtros de búsqueda de usuarios (agencia y puesto)
 */
export function UserFilters({ filterAgencia, filterPuesto, onAgenciaChange, onPuestoChange }: UserFiltersProps) {
  const { queryAgencias } = useQueryAgencias();
  const { queryRoles } = useQueryRoles();

  return (
    <div className="flex gap-2">
      <Select value={filterAgencia} onValueChange={onAgenciaChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Filtrar por agencia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las agencias</SelectItem>
          {queryAgencias.data?.map((agencia) => (
            <SelectItem key={agencia.id} value={agencia.id.toString()}>
              {agencia.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filterPuesto} onValueChange={onPuestoChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Filtrar por puesto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los puestos</SelectItem>
          {queryRoles.data?.map((rol) => (
            <SelectItem key={rol.id} value={rol.id.toString()}>
              {rol.role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

