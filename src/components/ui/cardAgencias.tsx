import { TypographyH3, TypographyP, TypographySmall } from "./typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AgenciasModelTypes } from "@/interfaces/agencias.interfaces";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { FormAddAgency } from "../form/agencias/form-add-agency";
import { useState } from "react";

export const CardAgencias = ({ items }: { items: AgenciasModelTypes }) => {
  const { name, code, no_colaboradores, state, chif } = items;
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Card
            className={cn("rounded-4xl bg-linear-to-r from-[#444444] to-[#537F6F] text-white", {
              "bg-linear-to-r from-[#444444] to-[#7F5353]": state === false,
            })}
          >
            <CardHeader>
              <div className="flex flex-row-reverse items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users2 /> <span>+{no_colaboradores}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="relative flex size-3">
                    <span
                      className={cn("absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75", {
                        "bg-green-600": state === true,
                        "bg-[#F08080]": state === false,
                      })}
                    ></span>
                    <span
                      className={cn("relative inline-flex size-3 rounded-full bg-sky-500", {
                        "bg-green-600": state === true,
                        "bg-[#F08080]": state === false,
                      })}
                    ></span>
                  </span>
                  <span className="pb-1 text-sm font-medium text-white/60"> {items.code} </span>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col">
              <TypographyH3 text={name} className="text-ellipsis text-white" />
              <TypographyP text={chif?.name ? chif?.name.toLocaleLowerCase() : code} className="text-sm font-normal text-ellipsis capitalize" />
              <TypographySmall text="Jefe de Agencia" className="ml-auto font-thin text-white/80 capitalize" />
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Agencia</DialogTitle>
          <DialogDescription>Edita los datos de la agencia</DialogDescription>
        </DialogHeader>
        <FormAddAgency closeModal={() => setOpen(false)} items={items} />
      </DialogContent>
    </Dialog>
  );
};
