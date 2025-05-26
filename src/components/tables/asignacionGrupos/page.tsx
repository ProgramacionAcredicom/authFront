import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
export default function AsignacionGruposTable({
  setSelectedRows,
  columns,
  enableMultiRowSelection,
  groupIds,
}: {
  setSelectedRows?: (selected: GruposTypeModel[]) => void;
  columns: ColumnDef<GruposTypeModel>[];
  enableMultiRowSelection?: boolean;
  groupIds?: number[];
}) {
  return <DataTable columns={columns} setSelectedRows={setSelectedRows} enableMultiRowSelection={enableMultiRowSelection} groupIds={groupIds} />;
}
