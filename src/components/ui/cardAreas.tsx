import { TypographyH3, TypographyP, TypographySmall } from "./typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { useState } from "react";
import { Result } from "@/interfaces/areas.interfaces";
import { FormArea } from "../form/areas/form-area";

export const CardAreas = ({ items }: { items: Result }) => {
  const { chif, code, id, name, state } = items;
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
                  <span>ID: {id}</span>
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
              <TypographySmall text="Jefe de Área" className="ml-auto font-thin text-white/80" />
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Área</DialogTitle>
          <DialogDescription>Actualizar los datos del área</DialogDescription>
        </DialogHeader>
        <FormArea closeModal={() => setOpen(false)} items={items} />
      </DialogContent>
    </Dialog>
  );
};
