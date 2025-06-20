import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQueryAplicativos } from "@/hooks/aplicativos/useQueryAplicativos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppWindow, KeyRound, LetterText } from "lucide-react";
import { AsignarPermisosSchema } from "@/schemas/permisos/asignar-permisos.schema";
import { UseFormReturn } from "react-hook-form";
export const FormularioAsignarPermisos = ({ form }: { form: UseFormReturn<AsignarPermisosSchema> }) => {
  const { queryAplicativos } = useQueryAplicativos();

  return (
    <Form {...form}>
      <form id="formulario-asignar-permisos" className="space-y-4">
        <FormField
          control={form.control}
          name="aplicativo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aplicativo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full rounded-full" startContent={<AppWindow className="size-4" />}>
                    <SelectValue placeholder="Selecciona un aplicativo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {queryAplicativos.data?.map((aplicativo) => (
                    <SelectItem key={aplicativo.id} value={aplicativo.id.toString()}>
                      {aplicativo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Permiso</FormLabel>
              <FormControl>
                <Input {...field} startContent={<KeyRound className="size-4" />} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} startContent={<LetterText className="size-4" />} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
