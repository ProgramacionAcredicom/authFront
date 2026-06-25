import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ColaboradorSchema } from "@/schemas/colaboradores/colaborador.schema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colaboradorSchema } from "@/schemas/colaboradores/colaborador.schema";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Crown, Eye, EyeOff, IdCard, Loader2, Lock, LockKeyhole, LockOpen, Mail, Save, Upload, User, UserCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { useInView } from "react-intersection-observer";
import { useQueryRoles } from "@/hooks/roles/useQueryRoles";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { toast } from "sonner";
import { createColaborador } from "@/services/colaboradores/colaboradores.services";
import { AxiosError } from "axios";
import { ColaboradorIDType, UserType } from "@/interfaces/colaboradores.interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useMutationUpdateColaborador } from "@/hooks/colaboradores/useMutationColaboradores";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQueryListAreasSinPaginacion } from "@/hooks/areas/useQueryAreas";
import { useQueryAgencias } from "@/hooks/agencias/useQueryAgencias";
import { Separator } from "@/components/ui/separator";
import { generatePassword } from "@/services/auth/auth.services";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GruposSeleccionados } from "./grupos-seleccionados";
import { splitName } from "@/lib/splitName";
import { logger } from "@/lib/logger";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryPuestos } from "@/hooks/puestos/useQueryPuestos";
import { buildColaboradorFormData } from "./form-colaborador.utils";
export const FormColaborador = ({ selectedGroups, setSelectedGroups, user }: { selectedGroups: GruposTypeModel[]; setSelectedGroups: (groups: GruposTypeModel[]) => void; user?: ColaboradorIDType }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [scrollContainerEl, setScrollContainerEl] = useState<HTMLDivElement | null>(null);
  const [hasModifiedGroups, setHasModifiedGroups] = useState(false);
  const isEdit = Boolean(user);

  const [activeTab, setActiveTab] = useState("personal");
  const observerOptions = { threshold: 0.15, root: scrollContainerEl, rootMargin: "-8% 0px -65% 0px" } as const;
  const { ref: personalRef, inView: personalInView } = useInView(observerOptions);
  const { ref: trabajoRef, inView: trabajoInView } = useInView(observerOptions);
  const { ref: credencialesRef, inView: credencialesInView } = useInView(observerOptions);
  const { ref: gruposRef, inView: gruposInView } = useInView(observerOptions);

  useEffect(() => {
    if (!scrollContainerEl) return;

    const sectionIds = ["personal", "trabajo", "credenciales", "grupos"] as const;
    const activationOffset = 20;

    const updateActiveTabFromScroll = () => {
      const containerRect = scrollContainerEl.getBoundingClientRect();
      let nextActive: (typeof sectionIds)[number] = "personal";

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        const top = section.getBoundingClientRect().top - containerRect.top;
        if (top <= activationOffset) {
          nextActive = id;
        } else {
          break;
        }
      }

      setActiveTab((prev) => (prev === nextActive ? prev : nextActive));
    };

    updateActiveTabFromScroll();
    scrollContainerEl.addEventListener("scroll", updateActiveTabFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveTabFromScroll);

    return () => {
      scrollContainerEl.removeEventListener("scroll", updateActiveTabFromScroll);
      window.removeEventListener("resize", updateActiveTabFromScroll);
    };
  }, [scrollContainerEl]);

  useEffect(() => {
    // Priorizar la sección más profunda visible para evitar que "Trabajo"
    // se mantenga activo cuando ya se está viendo "Credenciales".
    if (gruposInView) setActiveTab("grupos");
    else if (credencialesInView) setActiveTab("credenciales");
    else if (trabajoInView) setActiveTab("trabajo");
    else if (personalInView) setActiveTab("personal");
  }, [personalInView, trabajoInView, credencialesInView, gruposInView]);

  const handleTabClick = (val: string) => {
    setActiveTab(val);
    const section = document.getElementById(val);
    if (!section) return;

    if (scrollContainerEl) {
      const containerRect = scrollContainerEl.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const nextTop = scrollContainerEl.scrollTop + (sectionRect.top - containerRect.top) - 8;
      scrollContainerEl.scrollTo({ top: Math.max(nextTop, 0), behavior: "smooth" });
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const form = useForm<ColaboradorSchema>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      cif: user?.cif ?? "",
      email: user?.email ?? "",
      agency: user?.agency ? user.agency.id.toString() : "",
      role: user?.role ? user.role.id.toString() : "",
      password: isEdit ? "" : "",
      confirm_password: isEdit ? "" : "",
      picture: user?.picture ?? null,
      grup: [],
      user_type: isEdit
        ? (user?.user_type ? user.user_type.toUpperCase() : "")
        : "USUARIO",
      is_active: user?.is_active ?? true,
      is_blocked: user?.is_blocked ?? false,
      is_staff: user?.is_staff ?? false,
      is_superuser: user?.is_superuser ?? false,
      dpi: user?.dpi ?? "",
      area: user?.area?.id.toString() ?? "",
      executive_number: user?.ejecutivo_principal ?? null,
    },
    mode: "onChange",
  });

  const { queryAreasSinPaginacion } = useQueryListAreasSinPaginacion();
  const { queryAgencias } = useQueryAgencias();
  const dataAgencias = queryAgencias.data;
  // Manejar tanto array directo como objeto con results
  const areasData = Array.isArray(queryAreasSinPaginacion.data)
    ? queryAreasSinPaginacion.data
    : queryAreasSinPaginacion.data?.results || [];
  const { queryRoles } = useQueryRoles();
  const queryClient = useQueryClient();
  const { mutation } = useMutationUpdateColaborador();
  const initialRoleId = user?.role ? user.role.id.toString() : "";
  const initialUserGroupIds = user?.grupos?.map((group) => group.id) ?? [];
  const selectedRoleId = useWatch({
    control: form.control,
    name: "role",
    defaultValue: initialRoleId,
  });
  const syncedGroupIds = useWatch({
    control: form.control,
    name: "grup",
    defaultValue: initialUserGroupIds,
  });
  const roleChanged = isEdit && selectedRoleId !== initialRoleId;
  const { queryPuestoById } = useQueryPuestos(selectedRoleId, {
    enabled: Boolean(selectedRoleId) && (!isEdit || roleChanged),
  });
  const effectiveGroupIds = (!isEdit || roleChanged) ? (queryPuestoById.data?.grupos ?? []) : initialUserGroupIds;
  const fallbackUserGroups: GruposTypeModel[] = (user?.grupos ?? []).map((group) => ({
    id: group.id,
    nombre: group.nombre,
    aplicativos: [],
    permisos: group.permisos ?? [],
    users: [],
    users_count: 0,
    state: true,
  }));

  // Observar cambios en el nombre para generar automáticamente email y username (solo en creación)
  const watchedName = form.watch("name");
  const userHasEditedEmail = useRef(false);
  const userHasEditedUsername = useRef(false);

  // React Hook Form no actualiza defaultValues cuando cambia el prop `user`
  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      username: user?.username ?? "",
      cif: user?.cif ?? "",
      email: user?.email ?? "",
      agency: user?.agency ? user.agency.id.toString() : "",
      role: user?.role ? user.role.id.toString() : "",
      password: "",
      confirm_password: "",
      picture: user?.picture ?? null,
      grup: [],
      user_type: isEdit
        ? (user?.user_type ? user.user_type.toUpperCase() : "")
        : "USUARIO",
      is_active: user?.is_active ?? true,
      is_blocked: user?.is_blocked ?? false,
      is_staff: user?.is_staff ?? false,
      is_superuser: user?.is_superuser ?? false,
      dpi: user?.dpi ?? "",
      area: user?.area?.id.toString() ?? "",
      executive_number: user?.ejecutivo_principal ?? null,
    });

    userHasEditedEmail.current = false;
    userHasEditedUsername.current = false;
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [user?.id, isEdit, form, user]);

  useEffect(() => {
    const selectedIds = selectedGroups.map((group) => group.id);

    if (JSON.stringify(selectedIds) === JSON.stringify(syncedGroupIds ?? [])) {
      return;
    }

    form.setValue("grup", selectedIds, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [form, selectedGroups, syncedGroupIds]);

  // Normalizar caracteres especiales (quitar tildes y convertir ñ a n)
  const normalizeString = (str: string): string => {
    return str
      .normalize("NFD") // Descompone caracteres con tildes
      .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos (tildes)
      .replace(/ñ/g, "n") // Convierte ñ a n
      .replace(/Ñ/g, "N"); // Convierte Ñ a N
  };

  // Generar email y username automáticamente cuando cambia el nombre (solo en creación)
  useEffect(() => {
    if (isEdit) return;

    if (!watchedName || watchedName.trim().length === 0) {
      return;
    }

    const nameParts = splitName(watchedName.trim());
    const { name: firstName, middleName, lastName } = nameParts;

    // Solo generar si tenemos al menos primer nombre, segundo nombre y primer apellido
    if (firstName && middleName && lastName) {
      const firstInitial = firstName.charAt(0).toLowerCase();
      const secondInitial = middleName.charAt(0).toLowerCase();
      // Normalizar y limpiar el apellido: quitar tildes, convertir ñ a n, eliminar espacios
      const lastNameNormalized = normalizeString(lastName.toLowerCase().replace(/\s+/g, ''));

      // Generar email solo si el usuario no lo ha editado manualmente
      if (!userHasEditedEmail.current) {
        const generatedEmail = `${firstInitial}${secondInitial}${lastNameNormalized}@acredicom.com.gt`;
        const currentEmail = form.getValues("email");
        if (currentEmail !== generatedEmail) {
          form.setValue("email", generatedEmail, { shouldValidate: true });
        }
      }

      // Generar username solo si el usuario no lo ha editado manualmente
      if (!userHasEditedUsername.current) {
        const generatedUsername = `mc${firstInitial}${secondInitial}${lastNameNormalized}`;
        const currentUsername = form.getValues("username");
        if (currentUsername !== generatedUsername) {
          form.setValue("username", generatedUsername, { shouldValidate: true });
        }
      }
    }
  }, [watchedName, isEdit, form]);

  const onSubmit = async (data: ColaboradorSchema) => {
    if (selectedGroups.length < 1) {
      toast.error("Debe seleccionar al menos un grupo");
      return;
    }

    const formData = buildColaboradorFormData({
      data,
      isEdit,
      selectedGroups,
      hasModifiedGroups,
    });

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) {
        const response = await mutation.mutateAsync({
          id: Number(user!.id),
          data: formData,
          config,
        });
        toast.success("Colaborador actualizado correctamente");

        // Mostrar información de webhooks si está disponible
        if (response?.webhooks && Array.isArray(response.webhooks) && response.webhooks.length > 0) {
          const successful = response.webhooks.filter((w: { ok: boolean }) => w.ok);
          const failed = response.webhooks.filter((w: { ok: boolean }) => !w.ok);

          const WebhookList = () => (
            <div className="mt-2 space-y-1">
              {successful.map((w: { aplicativo_nombre: string }, index: number) => (
                <div key={`success-${index}`} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{w.aplicativo_nombre}</span>
                </div>
              ))}
              {failed.map((w: { aplicativo_nombre: string }, index: number) => (
                <div key={`failed-${index}`} className="flex items-center gap-2 text-sm">
                  <X className="h-4 w-4 text-red-600" />
                  <span>{w.aplicativo_nombre}</span>
                </div>
              ))}
            </div>
          );

          if (failed.length > 0) {
            toast.error("Sincronización de webhooks", {
              description: <WebhookList />,
              duration: 5000,
            });
          } else {
            toast.success("Sincronización de webhooks", {
              description: <WebhookList />,
              duration: 5000,
            });
          }
        }
      } else {
        const response = await createColaborador(formData, config);
        toast.success("Colaborador creado correctamente");

        // Redirigir a la página de edición con el ID del usuario creado
        if (response?.id) {
          navigate(`/colaboradores/editar/${response.id}`);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["colaboradores"] });
    } catch (error) {
      logger.errorWithContext("Error al guardar colaborador", error);
      if (error instanceof AxiosError && error.response?.data) {
        const errs = error.response.data as Record<string, string[] | string>;
        Object.values(errs)
          .flat()
          .forEach((msg) => toast.error(String(msg)));
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue("picture", file, { shouldValidate: true });
  };
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleGeneratePassword = async () => {
    if (!user?.id) {
      toast.error("No se pudo obtener el ID del colaborador");
      return;
    }

    setIsGeneratingPassword(true);
    try {
      await generatePassword(user.id);
      toast.success("Contraseña generada y enviada al correo del usuario");
    } catch (error) {
      logger.errorWithContext("Error al generar contraseña", error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorMessage = error.response.data?.error || error.response.data?.message || "Error al generar la contraseña";
        toast.error(errorMessage);
      } else {
        toast.error("Error al generar la contraseña");
      }
    } finally {
      setIsGeneratingPassword(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 pb-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full min-h-0 flex-1 flex-col" encType="multipart/form-data">
          <Card className="flex h-full min-h-0 flex-col border-neutral-200 bg-white shadow-none dark:border-neutral-800 dark:bg-neutral-950 py-0">
            <div className="flex-shrink-0 border-b border-border/40 px-6 pt-6 pb-4">
              <Tabs value={activeTab} onValueChange={handleTabClick} className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="inline-flex h-auto min-w-max gap-1 rounded-xl bg-muted p-1">
                    <TabsTrigger value="personal" className="rounded-lg px-3 py-2">Personal</TabsTrigger>
                    <TabsTrigger value="trabajo" className="rounded-lg px-3 py-2">Trabajo</TabsTrigger>
                    <TabsTrigger value="credenciales" className="rounded-lg px-3 py-2">Credenciales</TabsTrigger>
                    <TabsTrigger value="grupos" className="rounded-lg px-3 py-2">Grupos y permisos</TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </div>

            <div ref={setScrollContainerEl} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              <CardContent className="p-6 pb-6">
                <div className="mt-0 flex flex-col gap-6">
                {/* Información personal */}
                <div id="personal" ref={personalRef} className="scroll-mt-2 flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 md:p-5">
                  <div className="flex flex-col gap-2">
                    <TypographyH3 text="Información personal" className="text-custom-foreground text-lg font-semibold" />
                    <Separator />
                  </div>

                  {/* Layout horizontal: Foto a la izquierda, campos a la derecha */}
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                    {/* Foto de perfil */}
                    <div className="flex-1 justify-center lg:justify-start">
                      <FormField
                        control={form.control}
                        name="picture"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-col items-center">
                              <FormLabel className="sr-only mb-2 w-full text-center">Foto del colaborador</FormLabel>
                              <FormControl>
                                <div className="group relative" onClick={openFileSelector}>
                                  <div className="relative">
                                    <Avatar className={`group-hover:border-primary size-40 cursor-pointer border-2 border-transparent transition-all ${!form.watch("is_active") ? "opacity-50" : ""}`}>
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
                                  </div>
                                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 items-center z-10">
                                    <Badge
                                      variant={form.watch("is_active") ? "default" : "secondary"}
                                      className={`cursor-pointer transition-all ${form.watch("is_active")
                                        ? "bg-green-500 text-white hover:bg-green-600 border-green-600"
                                        : "bg-gray-400 text-white hover:bg-gray-500 border-gray-500"
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newStatus = !form.watch("is_active");
                                        form.setValue("is_active", newStatus);
                                        // Si se marca inactivo, desmarcar Staff y Superuser
                                        if (!newStatus) {
                                          form.setValue("is_staff", false);
                                          form.setValue("is_superuser", false);
                                        }
                                        toast.success(newStatus ? "Colaborador activado" : "Colaborador inactivado", {
                                          duration: 2000,
                                        });
                                      }}
                                    >
                                      {form.watch("is_active") ? "Activo" : "Inactivo"}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`transition-all flex items-center gap-1 ${
                                        form.watch("is_blocked")
                                          ? "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800 hover:bg-rose-200 dark:hover:bg-rose-900/40 cursor-pointer font-medium"
                                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-900/40 cursor-pointer"
                                      }`}
                                      role="button"
                                      tabIndex={0}
                                      aria-label={form.watch("is_blocked") ? "Bloqueado" : "Desbloqueado"}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newStatus = !form.watch("is_blocked");
                                        form.setValue("is_blocked", newStatus);
                                        toast.success(newStatus ? "Usuario bloqueado" : "Usuario desbloqueado", {
                                          duration: 2000,
                                        });
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key !== "Enter" && e.key !== " ") return;
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const newStatus = !form.watch("is_blocked");
                                        form.setValue("is_blocked", newStatus);
                                        toast.success(newStatus ? "Usuario bloqueado" : "Usuario desbloqueado", {
                                          duration: 2000,
                                        });
                                      }}
                                    >
                                      {form.watch("is_blocked") ? <Lock className="h-3 w-3" /> : <LockOpen className="h-3 w-3" />}
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`transition-all flex items-center gap-1 ${!form.watch("is_active")
                                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
                                        : form.watch("is_staff")
                                          ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/40 cursor-pointer font-medium"
                                          : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300 opacity-60 cursor-pointer"
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // No permitir cambiar si está inactivo
                                        if (!form.watch("is_active")) {
                                          return;
                                        }
                                        const newStatus = !form.watch("is_staff");
                                        form.setValue("is_staff", newStatus);
                                        toast.success(newStatus ? "Staff activado" : "Staff desactivado", {
                                          duration: 2000,
                                        });
                                      }}
                                    >
                                      Staff
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`transition-all flex items-center gap-1 ${!form.watch("is_active")
                                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
                                        : form.watch("is_superuser")
                                          ? "bg-yellow-300 text-yellow-900 border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 cursor-pointer font-medium"
                                          : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300 opacity-60 cursor-pointer"
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // No permitir cambiar si está inactivo
                                        if (!form.watch("is_active")) {
                                          return;
                                        }
                                        const newStatus = !form.watch("is_superuser");
                                        form.setValue("is_superuser", newStatus);
                                        toast.success(newStatus ? "Superusuario activado" : "Superusuario desactivado", {
                                          duration: 2000,
                                        });
                                      }}
                                    >
                                      <Crown className="h-3 w-3" />
                                    </Badge>

                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer pointer-events-none">
                                    <Upload className="h-8 w-8 text-white" />
                                  </div>
                                  {field.value && (
                                    <div
                                      className="absolute top-2 right-2 cursor-pointer rounded-full bg-red-500 p-1 transition-colors hover:bg-red-600 z-10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        form.setValue("picture", null);
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
                    </div>

                    {/* Campos en layout híbrido */}
                    <div className="flex-3 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="w-full lg:col-span-2">
                            <FormLabel>Nombre del colaborador <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} startContent={<User />} className="w-full" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dpi"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>DPI <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                startContent={<IdCard />}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                className="w-full"
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
                        name="cif"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>ID <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                startContent={<IdCard />}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                className="w-full"
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
                    </div>
                  </div>
                </div>

                {/* Unidad de trabajo */}
                <div id="trabajo" ref={trabajoRef} className="scroll-mt-2 flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 md:p-5">
                  <div className="flex flex-col gap-2">
                    <TypographyH3 text="Unidad de trabajo" className="text-custom-foreground text-lg font-semibold" />
                    <Separator />
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    <FormField
                      control={form.control}
                      name="agency"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Agencia <span className="text-red-500">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn("w-full justify-between rounded-full bg-background dark:bg-neutral-900 font-normal", !field.value && "text-muted-foreground")}
                                >
                                  {field.value
                                    ? dataAgencias?.find((a) => a.id.toString() === field.value)?.name
                                    : "Buscar y seleccionar una agencia"}
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
                                    {dataAgencias?.map((agencia) => (
                                      <CommandItem
                                        key={agencia.id}
                                        value={agencia.name.toLowerCase()}
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
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Area</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn("w-full justify-between rounded-full bg-background dark:bg-neutral-900 font-normal min-w-0", !field.value && "text-muted-foreground")}
                                >
                                  <span className="min-w-0 truncate text-left">{field.value ? areasData.find((a) => a.id.toString() === field.value)?.name : "Buscar y seleccionar un área (opcional)"}</span>
                                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0" side="bottom" align="start">
                              <Command>
                                <CommandInput placeholder="Buscar area…" className="h-9" />
                                <CommandList>
                                  <CommandEmpty>Sin resultados.</CommandEmpty>
                                  <CommandGroup>
                                    <CommandItem value="" onSelect={() => form.setValue("area", "")}>
                                      Sin Area
                                      <Check className={cn("ml-auto size-4", field.value === "" ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                    {areasData.map((area: { id: number; name: string }) => (
                                      <CommandItem
                                        key={area.id}
                                        value={area.id.toString()}
                                        onSelect={() => {
                                          form.setValue("area", area.id.toString());
                                        }}
                                      >
                                        {area.name}
                                        <Check className={cn("ml-auto size-4", area.id.toString() === field.value ? "opacity-100" : "opacity-0")} />
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
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="flex flex-col lg:col-span-2">
                          <FormLabel>Puesto <span className="text-red-500">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn("w-full justify-between rounded-full bg-background dark:bg-neutral-900 font-normal min-w-0", !field.value && "text-muted-foreground")}
                                >
                                  <span className="min-w-0 truncate text-left">
                                    {field.value
                                      ? queryRoles.data?.find((r) => r.id.toString() === field.value)?.role
                                      : "Buscar y seleccionar un puesto"}
                                  </span>
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
                  </div>
                </div>

                {/* Credenciales */}
                <div id="credenciales" ref={credencialesRef} className="scroll-mt-2 flex flex-col gap-4 rounded-xl border border-border/60 bg-background p-4 md:p-5">
                  <div className="flex flex-col gap-2">
                    <TypographyH3 text="Credenciales" className="text-custom-foreground text-lg font-semibold" />
                    <Separator />
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    <FormField
                      control={form.control}
                      name="user_type"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Tipo de usuario <span className="text-red-500">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn("w-full justify-between rounded-full bg-background dark:bg-neutral-900 font-normal min-w-0", !field.value && "text-muted-foreground")}
                                >
                                  <span className="min-w-0 truncate text-left">{field.value ? field.value : "Seleccionar tipo de usuario"}</span>
                                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0" side="bottom" align="start">
                              <Command>
                                <CommandInput placeholder="Buscar tipo de usuario…" className="h-9" />
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
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              startContent={<Mail />}
                              onChange={(e) => {
                                if (!isEdit) {
                                  userHasEditedEmail.current = true;
                                }
                                field.onChange(e);
                              }}
                            />
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
                          <FormLabel>Usuario <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              startContent={<UserCircle />}
                              onChange={(e) => {
                                if (!isEdit) {
                                  userHasEditedUsername.current = true;
                                }
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="executive_number"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Numero de ejecutivo</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value ?? ""} startContent={<IdCard />} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Contraseña {!isEdit && <span className="text-red-500">*</span>}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              startContent={<LockKeyhole />}
                              placeholder={isEdit ? "Dejar vacío para mantener la actual" : "Ingrese una contraseña segura"}
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
                              className="w-full"
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
                        <FormItem className="w-full">
                          <FormLabel>Confirmar contraseña {!isEdit && <span className="text-red-500">*</span>}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              startContent={<LockKeyhole />}
                              placeholder={isEdit ? "Dejar vacío para mantener la actual" : "Confirme la contraseña"}
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
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator className="mt-6" />
                  {isEdit && (
                    <div>
                      <TypographyMuted text="Por motivos de seguridad, se recomienda enviar una contraseña aleatoria al correo del usuario." />
                      <Button
                        type="button"
                        onClick={handleGeneratePassword}
                        disabled={isGeneratingPassword}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-primary-foreground"
                      >
                        {isGeneratingPassword ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generando...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4" />
                            Enviar contraseña al correo
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Grupos Seleccionados */}
                <div id="grupos" ref={gruposRef} className="scroll-mt-2 rounded-xl border border-border/60 bg-background p-4 md:p-5">
                  <GruposSeleccionados
                    selectedGroups={selectedGroups}
                    setSelectedGroups={setSelectedGroups}
                    collaboratorKey={user?.id ?? "new-collaborator"}
                    groupIds={effectiveGroupIds}
                    fallbackGroups={isEdit ? fallbackUserGroups : []}
                    onManualSelectionChange={setHasModifiedGroups}
                  />
                </div>
                </div>
              </CardContent>
            </div>

            {/* Botones de acción */}
            <div className="flex-shrink-0 border-t border-border/40 bg-white/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-neutral-950/95 dark:supports-[backdrop-filter]:bg-neutral-950/80">
              <div className="flex justify-end gap-3">
                <Button type="button" size="sm" variant="outline" onClick={() => form.reset()}>
                  <X />
                  Cancelar
                </Button>
                <Button type="submit" size="sm" variant="custom2" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
};
