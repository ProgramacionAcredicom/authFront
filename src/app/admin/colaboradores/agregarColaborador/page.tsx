import { Title } from "@/components/title/Title";
import { FormColaborador } from "@/components/form/colaboradores/form-colaborador";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AsignacionGruposTable from "@/components/tables/asignacionGrupos/page";
import { useState } from "react";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { columns } from "@/components/tables/asignacionGrupos/columns";
export const AgregarColaboradorPage = () => {
  const navigate = useNavigate();
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>([]);

  return (
    <>
      <div className="flex items-center">
        <Button size="icon" onClick={() => navigate(-1)} className="text-custom-gray cursor-pointer bg-transparent hover:bg-transparent">
          <ArrowLeft />
        </Button>
        <Title text="Agregar" />
      </div>
      <div className="grid h-full grid-cols-1 gap-12 lg:grid-cols-2">
        <FormColaborador selectedGroups={selectedGroups} />
        <AsignacionGruposTable setSelectedRows={setSelectedGroups} columns={columns} enableMultiRowSelection={true} />
      </div>
    </>
  );
};
