import { getColaboradorById } from "@/services/colaboradores/colaboradores.services";
import { LoaderFunctionArgs } from "react-router-dom";

export async function ColaboradorLoader({ params }: LoaderFunctionArgs) {
  const user = await getColaboradorById(params.id as string);
  return { user };
}
