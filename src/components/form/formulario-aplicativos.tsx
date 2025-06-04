import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LetterText } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AsignarAplicativosSchema } from "@/schemas/aplicativos/asignar-aplicativos.schema";
// import { Button } from "../ui/button";
// import { toast } from "sonner";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
export const FormularioAplicativos = ({
  form,
  onSubmit,
}: {
  form: UseFormReturn<AsignarAplicativosSchema>;
  onSubmit: (data: AsignarAplicativosSchema) => void;
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} id="formulario-asignar-aplicativos" className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} startContent={<LetterText className="size-4" />} />
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
        <FormField
          control={form.control}
          name="configuracion"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Configuración (JSON)</FormLabel>
              <FormControl>
                <div className="max-h-[40vh] overflow-auto rounded border">
                  <CodeMirror
                    value={field.value}
                    height="200px"
                    extensions={[json()]}
                    onChange={(val) => field.onChange(val)}
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLine: true,
                    }}
                  />
                  {/* <Button
                    size="sm"
                    type="button"
                    variant="custom2"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      try {
                        const pretty = JSON.stringify(JSON.parse(field.value), null, 2);
                        field.onChange(pretty);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      } catch (e: unknown) {
                        toast.error(`JSON inválido`);
                      }
                    }}
                  >
                    Formatear
                  </Button> */}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
