import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FormArea } from "../form/areas/form-area";
export const ModalAreas = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="custom2">
          <Plus /> Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">Agregar Área</DialogTitle>
          <DialogDescription className="sr-only">Agrega un área</DialogDescription>
        </DialogHeader>
        <FormArea closeModal={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
