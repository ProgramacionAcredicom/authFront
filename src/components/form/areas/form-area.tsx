import { NumberIcon } from "@/components/icons/NumberIcon";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Loader2, Save, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useInfiniteColaboradores } from "@/hooks/colaboradores/useInfiniteColaboradores";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Result } from "@/interfaces/areas.interfaces";
import { MutationAreas, MutationUpdateAreas } from "@/hooks/areas/useMutationAreas";
import { areasSchema, AreasSchema } from "@/schemas/areas/areas.schemas";
export const FormArea = ({ closeModal, items }: { closeModal: () => void; items?: Result }) => {
  const { ref, inView } = useInView();
  const isEdit = Boolean(items);
  const form = useForm<AreasSchema>({
    resolver: zodResolver(areasSchema),
    defaultValues: {
      code: items?.code || "",
      name: items?.name || "",
      state: items?.state ?? true,
      chif: items?.chif?.id ?? undefined,
    },
    mode: "onChange",
  });

  const [searchNombre, setSearchNombre] = useState<string>("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteColaboradores(searchNombre);
  const mutationAreas = MutationAreas(closeModal);
  const mutationUpdateArea = MutationUpdateAreas(closeModal);
  const onSubmit = async (data: AreasSchema) => {
    if (isEdit) {
      await mutationUpdateArea.mutateAsync({ id: items!.id, data });
    } else {
      await mutationAreas.mutateAsync(data);
    }
  };
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="form-area">
          <div className="flex gap-4">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Código del área</FormLabel>
                  <FormControl>
                    <Input {...field} startContent={<NumberIcon />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nombre del área</FormLabel>
                  <FormControl>
                    <Input {...field} startContent={<Building />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4 space-y-2 rounded-lg">
            <div>
              <Label>Jefe del área</Label>
              <div className="flex items-center justify-between gap-2">
                <Input
                  className="max-w-3xs"
                  startContent={<Search />}
                  type="text"
                  placeholder="Buscar jefe del área"
                  value={searchNombre}
                  onChange={(e) => setSearchNombre(e.target.value)}
                />
                {isEdit && <Badge variant="default">{items?.chif?.name || "Sin jefe"}</Badge>}
              </div>
            </div>
            <div className="mt-2 h-96 space-y-1.5 overflow-y-auto rounded-3xl bg-gray-50 p-4">
              <FormField
                name="chif"
                control={form.control}
                render={({ field }) => (
                  <div key={field.value}>
                    {data?.pages.map((page) =>
                      page.results.length > 0 ? (
                        page.results.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              field.onChange(field.value === item.id ? null : item.id);
                            }}
                          >
                            <FormItem
                              key={item.id}
                              className="flex items-center rounded-lg border-b border-gray-100 px-4 py-2 last:border-b-0 odd:bg-gray-100 even:bg-gray-50"
                            >
                              <FormControl className="mr-3">
                                <Checkbox
                                  checked={field.value === item.id}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked ? item.id : null);
                                  }}
                                  id={item.id.toString()}
                                />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="text-custom-gray z-10 w-full font-bold" htmlFor={item.id.toString()}>
                                  {item.name}
                                </FormLabel>
                                <FormDescription className="text-custom-gray/80 text-sm font-normal">{item?.role?.role}</FormDescription>
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
            <FormMessage>{form.formState.errors.chif?.message}</FormMessage>
          </div>
          <FormField
            name="state"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col py-4">
                <FormLabel htmlFor="state">Estado del area</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} id="state" />
                  </FormControl>
                  <FormLabel className="text-custom-gray/80 text-sm font-semibold" htmlFor="state">
                    {field.value ? "Activa" : "Inactiva"}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button
          type="submit"
          variant="outline"
          onClick={() => {
            closeModal();
            form.reset();
          }}
        >
          <X />
          Cancelar
        </Button>
        <Button type="submit" variant="custom2" form="form-area" disabled={mutationAreas.isPending || mutationUpdateArea.isPending}>
          {mutationAreas.isPending || mutationUpdateArea.isPending ? <Loader2 className="animate-spin" /> : <Save />}
          Guardar
        </Button>
      </DialogFooter>
    </>
  );
};
