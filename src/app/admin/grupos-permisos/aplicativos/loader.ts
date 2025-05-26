import { getAplicativoById } from "@/services/aplicativos/aplicativos.services";
import { LoaderFunctionArgs } from "react-router-dom";

export async function AplicativoLoader({ params }: LoaderFunctionArgs) {
  const aplicativo = await getAplicativoById(params.id as string);
  return { aplicativo };
}
