import { useEffect, useState } from "react";
import { Loader2, Search, Trash2, Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CrearGrupoSchema } from "@/schemas/grupos/grupos.schema";
import { useQueryPermisos } from "@/hooks/permisos/useQueryPermisos";
import { useInView } from "react-intersection-observer";
export default function FormCrearGrupo({ form, onSubmit }: { form: UseFormReturn<CrearGrupoSchema>; onSubmit: (data: CrearGrupoSchema) => void }) {
  const [searchNombre, setSearchNombre] = useState("");
  const { useInfinitePermisos } = useQueryPermisos(undefined, searchNombre);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePermisos;
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const toggleSeleccionarTodos = () => {
    const allIds = data?.pages.flatMap((page) => page.results).map((permiso) => permiso.id) ?? [];
    form.setValue("permisos", allIds, { shouldValidate: true });
  };

  const eliminarSeleccionados = () => {
    form.setValue("permisos", [], { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-md rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="permisos-form">
          <header className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del grupo</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} startContent={<Users2 />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Permisos</Label>
              <Input
                className="max-w-3xs"
                startContent={<Search />}
                type="text"
                placeholder="Buscar permiso"
                value={searchNombre}
                onChange={(e) => setSearchNombre(e.target.value)}
              />
            </div>
          </header>
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={toggleSeleccionarTodos} type="button" className="text-custom-gray">
              Seleccionar todos
            </Button>
            <Button variant="ghost" size="icon" onClick={eliminarSeleccionados} type="button" className="text-custom-gray">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 h-96 space-y-1.5 overflow-y-auto rounded-3xl bg-gray-50 p-4">
            <FormField
              name="permisos"
              control={form.control}
              render={({ field }) => (
                <div>
                  {data?.pages.map((page) =>
                    page.results.length > 0 ? (
                      page.results.map((item) => (
                        <div key={item.id}>
                          <FormItem
                            key={item.id}
                            className="flex items-center rounded-lg border-b border-gray-100 px-4 py-2 last:border-b-0 odd:bg-gray-100 even:bg-gray-50"
                          >
                            <FormControl className="mr-3">
                              <Checkbox
                                checked={field.value.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked ? [...field.value, item.id] : field.value.filter((id) => id !== item.id);
                                  field.onChange(newValue);
                                }}
                                id={item.id.toString()}
                              />
                            </FormControl>
                            <div className="flex-1">
                              <FormLabel className="text-custom-gray z-10 w-full font-bold" htmlFor={item.id.toString()}>
                                {item.nombre}
                              </FormLabel>
                              <FormDescription className="text-custom-gray/80 text-sm font-normal">{item?.descripcion}</FormDescription>
                            </div>
                          </FormItem>
                        </div>
                      ))
                    ) : (
                      <div key="no-results" className="flex items-center justify-center">
                        <span className="text-custom-gray/80 text-sm font-normal">No se encontraron resultados</span>
                      </div>
                    ),
                  )}
                </div>
              )}
            />
            <div ref={ref} className="py-4">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                  <span className="ml-2">Cargando más...</span>
                </div>
              )}
            </div>
          </div>
          {form.formState.errors.permisos?.message && (
            <p className="text-destructive py-2 text-[0.8rem] font-medium">{form.formState.errors.permisos.message?.toString()}</p>
          )}
        </form>
      </Form>
    </div>
  );
}
