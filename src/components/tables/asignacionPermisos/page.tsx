// import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Result } from "@/interfaces/permisos.interfaces";

export default function AsignacionPermisosTable({
  setSelectedRows,
  columns,
  data,
  isLoading,
}: {
  setSelectedRows?: (selected: Result[]) => void;
  columns: ColumnDef<Result>[];
  data: Result[];
  isLoading: boolean;
}) {
  return <DataTable columns={columns} setSelectedRows={setSelectedRows} data={data} isLoading={isLoading} />;
}
