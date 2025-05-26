import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export const BreadcrumbDynamic = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const unmaskName = (masked: string) => {
    try {
      return decodeURIComponent(atob(masked.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
      return masked; // Si falla la decodificación, muestra el valor original
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="capitalize">
              Inicio
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.length > 0 && <BreadcrumbSeparator />}
        {pathnames.map((item, index) => {
          // const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const isNonLink = index === 0;

          // Decodificar solo el segmento después de "seguimiento"
          const displayName = pathnames[index - 1] === "seguimiento" || pathnames[index - 1] === "actualizacion" ? unmaskName(item) : item;

          return (
            <div key={index} className="flex items-center gap-1.5">
              <BreadcrumbItem>
                {isNonLink ? <span className="capitalize">{displayName}</span> : <span className="font-bold capitalize">{displayName}</span>}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
