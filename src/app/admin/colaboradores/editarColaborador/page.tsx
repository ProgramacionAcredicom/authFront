import { Title } from "@/components/title/Title";
import { FormColaborador } from "@/components/form/colaboradores/form-colaborador";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AsignacionGruposTable from "@/components/tables/asignacionGrupos/page";
import { useMemo, useState } from "react";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { Grupo } from "@/interfaces/colaboradores.interfaces";
import { columns } from "@/components/tables/asignacionGrupos/columns";

export const EditarColaboradorPage = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>([]);
  const memoGroupIds = useMemo(
    () => user?.grupos.map((g: Grupo) => g.id) ?? [],
    [user], // solo cambia si cambia el usuario
  );
  return (
    <>
      <div className="flex items-center">
        <Button size="icon" onClick={() => navigate(-1)} className="text-custom-gray cursor-pointer bg-transparent hover:bg-transparent">
          <ArrowLeft />
        </Button>
        <Title text="Editar" />
      </div>
      <div className="grid h-full grid-cols-1 gap-12 lg:grid-cols-2">
        <FormColaborador selectedGroups={selectedGroups} user={user ?? undefined} />
        <AsignacionGruposTable setSelectedRows={setSelectedGroups} columns={columns} enableMultiRowSelection={true} groupIds={memoGroupIds} />
      </div>
    </>
  );
};
