import { useLocation } from "react-router-dom";
import { TypographyH2 } from "../ui/typography";

export const Title = ({ text }: { text?: string }) => {
  const pathName = useLocation().pathname;

  const pathNameArray = pathName.split("/")[1];

  if (pathName !== "/") {
    return (
      <div className="flex gap-2">
        <TypographyH2
          className="pb-0 text-base capitalize md:pb-2 md:text-2xl"
          text={`${pathNameArray.replace(/-/g, " ")} /`}
        />
        <span className="text-muted-foreground text-base md:text-2xl">{text}</span>
      </div>
    );
  }

  return <TypographyH2 className="capitalize" text={pathName === "/" ? "Inicio" : ""} />;
};
