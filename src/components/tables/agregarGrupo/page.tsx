import { Grupo, columns } from "./columns";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";

async function getData(): Promise<Grupo[]> {
  // Fetch data from your API here.
  return [
    {
      grupo: "OB ADMIN",
      permiso: "Verificar solicitud",
      status: "active",
    },
    {
      grupo: "OB ADMIN",
      permiso: "Actualizar solicitud",
      status: "desactive",
    },
    {
      grupo: "OB ADMIN",
      permiso: "Administrar reporteria",
      status: "active",
    },
  ];
}

export default function AgregarGrupoTable() {
  const queryAgregarGrupo = useQuery({
    queryKey: ["agregarGrupo"],
    queryFn: getData,
  });
  return <DataTable columns={columns} data={queryAgregarGrupo.data} />;
}
