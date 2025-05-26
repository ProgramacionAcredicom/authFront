import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FormAddAgency } from "../form/agencias/form-add-agency";
export const ModalAgregarAgencia = () => {
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
          <DialogTitle className="text-custom-gray font-bold">Agregar Agencia</DialogTitle>
          <DialogDescription className="sr-only">Agrega una agencia</DialogDescription>
        </DialogHeader>
        <FormAddAgency closeModal={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
