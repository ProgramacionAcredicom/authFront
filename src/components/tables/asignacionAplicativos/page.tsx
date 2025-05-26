// import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";

export default function AsignacionAplicativosTable({ columns, data }: { columns: ColumnDef<AplicativosTypeModel>[]; data: AplicativosTypeModel[] }) {
  return <DataTable columns={columns} data={data} />;
}
