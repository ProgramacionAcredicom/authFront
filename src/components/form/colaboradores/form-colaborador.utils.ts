import { GruposTypeModel } from "@/interfaces/grupos.interfaces";
import { ColaboradorSchema } from "@/schemas/colaboradores/colaborador.schema";

interface BuildColaboradorFormDataParams {
  data: ColaboradorSchema;
  isEdit: boolean;
  selectedGroups: GruposTypeModel[];
  hasModifiedGroups: boolean;
}

export const buildColaboradorFormData = ({ data, isEdit, selectedGroups, hasModifiedGroups }: BuildColaboradorFormDataParams) => {
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
  formData.append("is_blocked", String(data.is_blocked ?? false));
  formData.append("is_staff", String(data.is_staff ?? false));
  formData.append("is_superuser", String(data.is_superuser ?? false));

  if (data.area) {
    formData.append("area", data.area);
  } else {
    formData.append("area", "");
  }

  if (data.executive_number != null) {
    formData.append("executive_number", String(data.executive_number));
  }

  if (!isEdit || (data.password && data.confirm_password)) {
    formData.append("password", data.password ?? "");
    formData.append("confirm_password", data.confirm_password ?? "");
  }

  if (isEdit || hasModifiedGroups) {
    selectedGroups.forEach((group) => {
      formData.append("grup", String(group.id));
    });
  }

  if (data.picture instanceof File) {
    formData.append("picture", data.picture);
  } else if (data.picture === null) {
    formData.append("picture", "");
  }

  return formData;
};
