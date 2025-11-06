import { Title } from "@/components/title/Title";
import { FormColaborador } from "@/components/form/colaboradores/form-colaborador";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";

export const EditarColaboradorPage = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [selectedGroups, setSelectedGroups] = useState<GruposTypeModel[]>([]);
  return (
    <>
      <div className="flex items-center">
        <Button size="icon" onClick={() => navigate(-1)} className="text-custom-gray cursor-pointer bg-transparent hover:bg-transparent">
          <ArrowLeft />
        </Button>
        <Title text="Editar" />
      </div>
      <div className="flex flex-col gap-12 w-full">
        <FormColaborador selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} user={user ?? undefined} />
      </div>
    </>
  );
};
