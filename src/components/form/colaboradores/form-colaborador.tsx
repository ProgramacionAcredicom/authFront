import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ColaboradorSchema } from "@/schemas/colaboradores/colaborador.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colaboradorSchema } from "@/schemas/colaboradores/colaborador.schema";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Eye, EyeOff, IdCard, Loader2, LockKeyhole, Mail, Save, Upload, User, UserCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { useQueryAgencias } from "@/hooks/agencias/useQueryAgencias";
import { Switch } from "@/components/ui/switch";
import { useQueryRoles } from "@/hooks/roles/useQueryRoles";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { toast } from "sonner";
import { createColaborador } from "@/services/colaboradores/colaboradores.services";
import { AxiosError } from "axios";
import { ColaboradorIDType, CrearColaboradorType, UserType } from "@/interfaces/colaboradores.interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useMutationUpdateColaborador } from "@/hooks/colaboradores/useMutationColaboradores";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const FormColaborador = ({ selectedGroups, user }: { selectedGroups: GruposTypeModel[]; user?: ColaboradorIDType }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isEdit = Boolean(user);
  const form = useForm<ColaboradorSchema>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      cif: user?.cif ?? "",
      email: user?.email ?? "",
      agency: user?.agency ? user.agency.id.toString() : "",
      role: user?.role ? user.role.id.toString() : "",
      password: isEdit ? "" : "Acredicom2025.",
      confirm_password: isEdit ? "" : "Acredicom2025.",
      picture: user?.picture ?? null,
      grup: [],
      user_type: user?.user_type.toUpperCase() as UserType,
      is_active: user?.is_active ?? true,
      executive_number: null,
      dpi: user?.dpi ?? "",
    },
    mode: "onChange",
  });

  const name = form.watch("name");

  useEffect(() => {
    if (name) {
      const username = generateUsername(name);
      form.setValue("username", username);
      const email = generateEmail(name);
      form.setValue("email", email);
    }
  }, [name, form]);

  const { queryAgencias } = useQueryAgencias();
  const { queryRoles } = useQueryRoles();
  // Función para generar el username
  const generateUsername = (fullName: string) => {
    const names = fullName
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(" ");

    if (names.length < 2) return "";

    const firstInitial = names[0]?.charAt(0) || "";
    const secondInitial = names[1]?.charAt(0) || "";
    const lastName = names.find((name, index) => index > 1 && name.length > 3) || "";

    // Elimina caracteres no alfabéticos del apellido
    const cleanLastName = lastName.replace(/[^A-Z]/g, "");

    return `MC${firstInitial}${secondInitial}${cleanLastName}`;
  };

  const generateEmail = (fullName: string) => {
    const names = fullName
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(" ");

    if (names.length < 2) return "";

    const firstInitial = names[0]?.charAt(0) || "";
    const secondInitial = names[1]?.charAt(0) || "";
    const lastName = names.find((name, index) => index > 1 && name.length > 3) || "";

    const cleanLastName = lastName.replace(/[^a-z]/g, "");

    return `${firstInitial}${secondInitial}${cleanLastName}@acredicom.com.gt`;
  };
  const queryClient = useQueryClient();
  const route = useNavigate();
  const { mutation } = useMutationUpdateColaborador();

  const onSubmit = async (data: ColaboradorSchema) => {
    if (selectedGroups.length < 1) {
      toast.error("Debe seleccionar al menos un grupo");
      return;
    }

    // 1. Construir FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("dpi", data.dpi);
    formData.append("cif", data.cif);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("agency", data.agency);
    formData.append("role", data.role);
    formData.append("user_type", data.user_type);
    formData.append("is_active", String(data.is_active));
    if (data.executive_number != null) {
      formData.append("executive_number", String(data.executive_number));
    }
    // Contraseña (solo si aplica)
    if (!isEdit || (data.password && data.confirm_password)) {
      formData.append("password", data.password!);
      formData.append("confirm_password", data.confirm_password!);
    }
    // Grupos
    selectedGroups.forEach((g) => {
      formData.append("grup[]", String(g.id));
    });
    // Imagen
    if (data.picture instanceof File) {
      formData.append("picture", data.picture);
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) {
        await mutation.mutateAsync({
          id: Number(user!.id),
          data: formData as unknown as CrearColaboradorType,
          config,
        });
        toast.success("Colaborador actualizado correctamente");
      } else {
        await createColaborador(formData as unknown as CrearColaboradorType, config);
        toast.success("Colaborador creado correctamente");
      }

      form.reset();
      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
      route("/colaboradores", { replace: true });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response?.data) {
        const errs = error.response.data as Record<string, string[] | string>;
        Object.values(errs)
          .flat()
          .forEach((msg) => toast.error(String(msg)));
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    form.setValue("picture", file, { shouldValidate: true });
    setIsUploading(false);
  };
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="flex h-full flex-col gap-4">
      <header>
        <TypographyH3 text="Agregar colaborador" className="text-custom-gray" />
        <TypographyMuted text="Agrega un nuevo colaborador :)" />
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4" encType="multipart/form-data">
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="sr-only mb-2 w-full text-center">Foto del colaborador</FormLabel>
                  <FormControl>
                    <div className="group relative" onClick={openFileSelector}>
                      <Avatar className="group-hover:border-primary size-52 cursor-pointer border-2 border-transparent transition-all">
                        <AvatarImage
                          src={
                            typeof field.value === "object" && field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : typeof field.value === "string"
                                ? field.value
                                : undefined
                          }
                        />
                        <AvatarFallback className="text-lg">
                          {user?.name
                            ? user.name
                                .split(" ")
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")
                            : "AC"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                      {field.value && (
                        <div
                          className="absolute top-2 right-5 cursor-pointer rounded-full bg-red-500 p-1 transition-colors hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent opening file dialog
                            form.setValue("picture", "");
                          }}
                        >
                          <X className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                    </div>
                  </FormControl>
                  <FormDescription className="sr-only mt-2 text-center">Haz clic en la imagen para cambiarla</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dpi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DPI</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      startContent={<IdCard />}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del colaborador</FormLabel>
                  <FormControl>
                    <Input {...field} startContent={<User />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <FormControl>
                    <Input {...field} startContent={<UserCircle />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      startContent={<IdCard />}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input {...field} startContent={<Mail />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agency"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Agencia</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between rounded-full bg-white font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? queryAgencias.data?.find((a) => a.id.toString() === field.value)?.name : "Selecciona una agencia"}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0" side="bottom" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar agencia…" className="h-9" />
                        <CommandList>
                          <CommandEmpty>Sin resultados.</CommandEmpty>
                          <CommandGroup>
                            {queryAgencias.data?.map((agencia) => (
                              <CommandItem
                                key={agencia.id}
                                value={agencia.name}
                                onSelect={() => {
                                  form.setValue("agency", agencia.id.toString());
                                }}
                              >
                                {agencia.name}
                                <Check className={cn("ml-auto size-4", agencia.id.toString() === field.value ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Puesto</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-full justify-between rounded-full bg-white font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? queryRoles.data?.find((r) => r.id.toString() === field.value)?.role : "Selecciona un puesto"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0" side="bottom" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar puesto…" className="h-9" />
                      <CommandList>
                        <CommandEmpty>Sin resultados.</CommandEmpty>
                        <CommandGroup>
                          {queryRoles.data?.map((role) => (
                            <CommandItem
                              key={role.id}
                              value={role.role}
                              onSelect={() => {
                                form.setValue("role", role.id.toString());
                              }}
                            >
                              {role.role}
                              <Check className={cn("ml-auto size-4", role.id.toString() === field.value ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Estado</FormLabel>
                    <FormDescription> {field.value ? "Activo" : "Inactivo"} </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="space-y-0.5">
                    <FormLabel>Tipo de usuario</FormLabel>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between rounded-full bg-white font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? field.value : "Selecciona un puesto"}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0" side="bottom" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar puesto…" className="h-9" />
                        <CommandList>
                          <CommandEmpty>Sin resultados.</CommandEmpty>
                          <CommandGroup>
                            {Object.values(UserType).map((role) => (
                              <CommandItem
                                key={role}
                                value={role}
                                onSelect={() => {
                                  form.setValue("user_type", role);
                                }}
                              >
                                {role}
                                <Check className={cn("ml-auto size-4", role === field.value ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    startContent={<LockKeyhole />}
                    endContent={
                      <>
                        {showPassword ? (
                          <Eye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />
                        ) : (
                          <EyeOff onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />
                        )}
                      </>
                    }
                    type={showPassword ? "text" : "password"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    startContent={<LockKeyhole />}
                    endContent={
                      <>
                        {showConfirmPassword ? (
                          <Eye onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer" />
                        ) : (
                          <EyeOff onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="cursor-pointer" />
                        )}
                      </>
                    }
                    type={showConfirmPassword ? "text" : "password"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => form.reset()}>
              <X />
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="custom2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
