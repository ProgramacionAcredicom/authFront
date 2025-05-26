import { useMutationEditarPermiso, useMutationPermisos, useMutationEliminarPermiso } from "@/hooks/permisos/useMutationPermisos";
import { PermisosCreateType } from "@/interfaces/permisos.interfaces";
import { AsignarPermisosSchema, asignarPermisosSchema, ListarPermisosSchema, listarPermisosSchema } from "@/schemas/permisos/asignar-permisos.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

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

interface FormularioPermisosEditar {
  nombre: string;
  descripcion: string;
  aplicativo: { id: number };
}

export const useFormPermisosEditar = (data?: FormularioPermisosEditar, setOpen?: (open: boolean) => void, id?: string) => {
  const [searchParams] = useSearchParams();
  const idAplicativo = searchParams.get("id");
  console.log(idAplicativo);
  console.log(data?.aplicativo);
  const form = useForm<AsignarPermisosSchema>({
    resolver: zodResolver(asignarPermisosSchema),
    defaultValues: {
      nombre: data?.nombre ?? "",
      descripcion: data?.descripcion ?? "",
      aplicativo: data?.aplicativo?.id.toString() ?? "",
    },
    mode: "onChange",
  });
  const { mutatePermiso, isLoading } = useMutationEditarPermiso();
  const onSubmit = async (data: AsignarPermisosSchema) => {
    const payload = {
      nombre: data?.nombre,
      descripcion: data?.descripcion,
      aplicativo: Number(data?.aplicativo),
    };
    // console.log(payload);
    await mutatePermiso.mutateAsync({ id: id!, permiso: payload });
    form.reset();
    setOpen?.(false);
  };
  return {
    form,
    onSubmit,
    isLoading,
  };
};

export const useFormPermisosEliminar = (data?: FormularioPermisosEditar, setOpen?: (open: boolean) => void, id?: string) => {
  const form = useForm<AsignarPermisosSchema>({
    resolver: zodResolver(asignarPermisosSchema),
    defaultValues: {
      nombre: data?.nombre ?? "",
      descripcion: data?.descripcion ?? "",
      aplicativo: data?.aplicativo?.id.toString() ?? "",
    },
    mode: "onChange",
  });
  const { mutatePermiso, isLoading } = useMutationEliminarPermiso();
  const onSubmit = async () => {
    await mutatePermiso.mutateAsync({ id: id! });
    form.reset();
    setOpen?.(false);
  };
  return {
    form,
    onSubmit,
    isLoading,
  };
};
