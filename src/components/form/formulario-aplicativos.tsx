import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LetterText, Power, PowerOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AsignarAplicativosSchema } from "@/schemas/aplicativos/asignar-aplicativos.schema";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Switch } from "../ui/switch";
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            name="state"
            render={({ field }) => (
              <FormItem>
                <div className="bg-card flex items-center justify-between rounded-lg border p-2">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-full p-2 ${field.value ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {field.value ? <Power className="size-4" /> : <PowerOff className="size-4" />}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium">Estado del Aplicativo</FormLabel>
                      <p className="text-muted-foreground text-xs">{field.value ? "El aplicativo está activo " : "El aplicativo está desactivado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-green-600" />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
