import { useMutationEditarPermiso, useMutationPermisos, useMutationEliminarPermiso } from "@/hooks/permisos/useMutationPermisos";
import { PermisosCreateType, ResultModel } from "@/interfaces/permisos.interfaces";
import { AsignarPermisosSchema, asignarPermisosSchema, ListarPermisosSchema, listarPermisosSchema } from "@/schemas/permisos/asignar-permisos.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useFormPermisos = () => {
  const [params] = useSearchParams();
  const idAplicativo = params.get("id");
  const form = useForm<AsignarPermisosSchema>({
    resolver: zodResolver(asignarPermisosSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      aplicativo: idAplicativo ?? "",
    },
    mode: "onChange",
  });

  return {
    form,
  };
};

export const useFormListaPermisos = ({
  permisos,
  setPermisos,
  setOpen,
}: {
  permisos: AsignarPermisosSchema[];
  setPermisos: (permisos: AsignarPermisosSchema[]) => void;
  setOpen: (open: boolean) => void;
}) => {
  const { mutatePermiso, isLoading } = useMutationPermisos();
  const formListaPermisos = useForm<ListarPermisosSchema>({
    resolver: zodResolver(listarPermisosSchema),
    defaultValues: {
      permisos: [],
    },
    mode: "onChange",
  });
  useEffect(() => {
    formListaPermisos.setValue("permisos", permisos, { shouldValidate: true });
  }, [permisos, formListaPermisos]);
  const onSubmitListaPermisos = async (data: ListarPermisosSchema) => {
    // transforma el campo aplicativo de string a number
    const payload: PermisosCreateType = {
      permisos: data.permisos.map((p) => ({
        nombre: p.nombre,
        descripcion: p.descripcion,
        aplicativo: Number(p.aplicativo), // <-- aquí
      })),
    };
    await mutatePermiso.mutateAsync(payload);
    formListaPermisos.reset();
    setPermisos([]);
    setOpen(false);
  };
  const submitLista = formListaPermisos.handleSubmit(onSubmitListaPermisos);
  return {
    formListaPermisos,
    submitLista,
    isLoading,
  };
};

export const useFormPermisosEditar = (data?: ResultModel, setOpen?: (open: boolean) => void, id?: string) => {
  const form = useForm<AsignarPermisosSchema>({
    resolver: zodResolver(asignarPermisosSchema),
    defaultValues: {
      nombre: data?.nombre ?? "",
      descripcion: data?.descripcion ?? "",
      aplicativo: data?.aplicativo?.id.toString() ?? "",
    },
    mode: "onChange",
  });

  // Actualizar el formulario cuando los datos cambien
  useEffect(() => {
    if (data) {
      form.reset({
        nombre: data.nombre ?? "",
        descripcion: data.descripcion ?? "",
        aplicativo: data.aplicativo?.id.toString() ?? "",
      });
    }
  }, [data, form]);

  const { mutatePermiso, isLoading } = useMutationEditarPermiso();
  const onSubmit = async (formData: AsignarPermisosSchema) => {
    if (!id) {
      toast.error("ID no válido");
      return;
    }
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    };
    await mutatePermiso.mutateAsync({ id, permiso: payload });
    form.reset();
    setOpen?.(false);
  };
  return {
    form,
    onSubmit,
    isLoading,
  };
};

export const useFormPermisosEliminar = (data?: ResultModel, setOpen?: (open: boolean) => void, id?: string) => {
  const form = useForm<AsignarPermisosSchema>({
    resolver: zodResolver(asignarPermisosSchema),
    defaultValues: {
      nombre: data?.nombre ?? "",
      descripcion: data?.descripcion ?? "",
      aplicativo: data?.aplicativo?.id.toString() ?? "",
    },
    mode: "onChange",
  });

  // Actualizar el formulario cuando los datos cambien
  useEffect(() => {
    if (data) {
      form.reset({
        nombre: data.nombre ?? "",
        descripcion: data.descripcion ?? "",
        aplicativo: data.aplicativo?.id.toString() ?? "",
      });
    }
  }, [data, form]);

  const { mutatePermiso, isLoading } = useMutationEliminarPermiso();
  const onSubmit = async () => {
    if (!id) {
      toast.error("ID no válido");
      return;
    }
    await mutatePermiso.mutateAsync({ id });
    form.reset();
    setOpen?.(false);
  };
  return {
    form,
    onSubmit,
    isLoading,
  };
};
