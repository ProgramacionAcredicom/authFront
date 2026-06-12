import type { UsuarioType } from "@/interfaces/perfilUsuario.interfaces";

export const OAUTH_PERMISSIONS = {
  MOVEMENTS_ACCESS: "acceso_movimientos",
  MOVEMENTS_REPORT_ACCESS: "acceso_reporteria_movimientos",
  AUDIT_LOG_ACCESS: "consultar_log_auditoria",
  ACCESS_MY_REQUESTS: "acceso_mis_solicitudes",
  MANAGE_ACCESS_REQUESTS: "administrar_solicitudes",
  CREATE_ACCESS_REQUEST: "crear_solicitud",
  VIEW_ACCESS_REQUEST: "ver_solicitud",
  LIST_ACCESS_SYSTEMS: "listar_sistemas_acceso",
  CHANGE_ACCESS_REQUEST_STATUS: "cambiar_estado_solicitud",
  LIST_POSITIONS: "listar_puestos",
  VIEW_POSITION: "ver_puesto",
  CREATE_POSITION: "crear_puesto",
  UPDATE_POSITION: "actualizar_puesto",
  DEACTIVATE_POSITION: "desactivar_puesto",
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
