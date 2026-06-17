import { useEffect } from "react";
import { Briefcase } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { GruposSeleccionados } from "@/components/form/colaboradores/grupos-seleccionados";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { PuestoSchema } from "@/schemas/puestos/puestos.schema";

interface FormPuestoProps {
  form: UseFormReturn<PuestoSchema>;
  onSubmit: (data: PuestoSchema) => void;
  selectedGroups: GruposTypeModel[];
  setSelectedGroups: (groups: GruposTypeModel[]) => void;
}

export function FormPuesto({ form, onSubmit, selectedGroups, setSelectedGroups }: FormPuestoProps) {
  const groupIds = form.watch("grupos") ?? [];

  useEffect(() => {
    const selectedIds = selectedGroups.map((group) => group.id);

    if (JSON.stringify(selectedIds) === JSON.stringify(groupIds)) {
      return;
    }

    form.setValue("grupos", selectedIds, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [form, groupIds, selectedGroups]);

  return (
    <div className="w-full max-w-4xl rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="formulario-puesto">
          <header className="mb-4 flex w-full items-center gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="min-w-xs">
                  <FormLabel>Nombre del puesto</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} startContent={<Briefcase className="size-4" />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="mt-6 flex items-center gap-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} className="m-0" />
                  </FormControl>
                  <FormLabel>Estado</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </header>

          <GruposSeleccionados
            selectedGroups={selectedGroups}
            setSelectedGroups={setSelectedGroups}
            groupIds={groupIds}
          />

          {form.formState.errors.grupos?.message ? (
            <p className="text-destructive mt-2 text-[0.8rem] font-medium">{form.formState.errors.grupos.message?.toString()}</p>
          ) : null}
        </form>
      </Form>
    </div>
  );
}
