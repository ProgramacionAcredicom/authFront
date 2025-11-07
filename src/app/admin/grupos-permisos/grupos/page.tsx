import { Title } from "@/components/title/Title";
import TabGrupos from "./tab-grupos";
import { Outlet } from "react-router-dom";

export const GruposPage = () => {
  return (
    <>
      <Title text="Grupos" />
      <TabGrupos />
      <Outlet />
    </>
  );
};

