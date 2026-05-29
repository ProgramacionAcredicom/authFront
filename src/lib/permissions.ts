import type { UsuarioType } from "@/interfaces/perfilUsuario.interfaces";

export const OAUTH_PERMISSIONS = {
  MOVEMENTS_ACCESS: "acceso_movimientos",
  MOVEMENTS_REPORT_ACCESS: "acceso_reporteria_movimientos",
  LIST_ROLES: "listar_roles_oauth",
  LIST_AGENCIES: "listar_agencias_oauth",
  LIST_USERS: "listar_usuarios_oauth",
} as const;

export type OAuthPermission = (typeof OAUTH_PERMISSIONS)[keyof typeof OAUTH_PERMISSIONS];

type PermissionUser = Pick<UsuarioType, "is_staff" | "oauth_perms"> | null | undefined;

export function hasAccess(user: PermissionUser, permission?: OAuthPermission) {
  if (!user) {
    return false;
  }

  if (user.is_staff) {
    return true;
  }

  if (!permission) {
    return true;
  }

  return user.oauth_perms?.includes(permission) ?? false;
}
