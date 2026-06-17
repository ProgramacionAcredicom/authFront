import type React from "react";
import { Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import { CrearGrupoSchema } from "@/schemas/grupos/grupos.schema";
import { Switch } from "../ui/switch";
import { SelectPermisosField } from "@/components/form/permisos/select-permisos-field";

export default function FormCrearGrupo({ form, onSubmit }: { form: UseFormReturn<CrearGrupoSchema>; onSubmit: (data: CrearGrupoSchema) => void }) {
  // ──────────── 6) Render ────────────
  return (
    <div className="w-full max-w-4xl rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="permisos-form">
          {/* ======== HEADER (Nombre + Estado) ======== */}
          <header className="mb-4 flex w-full items-center gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="min-w-xs">
                  <FormLabel>Nombre del grupo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
                      <Input type="text" {...field} className="pl-10" />
                    </div>
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

          {/* ======== GRID PRINCIPAL ======== */}
          <SelectPermisosField form={form} name="permisos" />

          {form.formState.errors.permisos?.message && (
            <p className="text-destructive mt-2 text-[0.8rem] font-medium">{form.formState.errors.permisos.message?.toString()}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
