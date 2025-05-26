import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyP, TypographySmall } from "@/components/ui/typography";
import { Link } from "react-router-dom";
import LogoAcredicom from "@/assets/img/Logo_Acredicom_Ligth.png";
export default function Page404() {
  return (
    <section className="container mx-auto flex h-screen flex-wrap items-center justify-center">
      <div className="text-custom flex w-1/2 flex-col items-start justify-center gap-y-14 border">
        <TypographyH2 text="404" className="text-custom text-8xl" />
        <TypographyP text="Lo sentimos, esta página no ha sido encontrada." className="text-5xl" />
        <TypographySmall text="Regresa al inicio" className="text-2xl font-normal" />
        <Button variant="custom" className="-mt-4 rounded-none p-7 text-2xl">
          <Link to="/">Regresar al inicio</Link>
        </Button>
      </div>
      <div className="flex w-1/2">
        <img src={LogoAcredicom} alt="Logo Acredicom" className="w-full" />
      </div>
    </section>
  );
}
