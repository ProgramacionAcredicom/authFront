import { format } from "date-fns";

export type ActionType = "alta" | "baja" | "movimiento" | "rotacion";

export interface CollaboratorInfo {
  id?: number;
  name: string;
  agency: string;
  position: string;
  username?: string;
  email?: string;
  executive?: string;
  password?: string;
}

export interface Movement {
  id: string;
  actionType: ActionType;
  effectiveDate: string;
  collaborator: CollaboratorInfo | null;
  newName?: string;
  newDpi?: string;
  newId?: string;
  newAgency?: string;
  newPosition?: string;
  observations: string;
}

export type MovementFieldName =
  | "collaborator"
  | "effectiveDate"
  | "newAgency"
  | "newDpi"
  | "newName"
  | "newPosition";

export type MovementValidationErrors = Partial<Record<MovementFieldName, string>>;

export interface SearchableSelectOption {
  label: string;
  value: string;
  keywords?: string[];
}

export const ACTION_LABELS: Record<ActionType, string> = {
  alta: "Alta",
  baja: "Baja",
  movimiento: "Movimiento",
  rotacion: "Rotación",
};

export const ACTION_DESCRIPTIONS: Record<ActionType, string> = {
  alta: "Ingreso de un nuevo colaborador",
  baja: "Salida de un colaborador",
  movimiento: "Cambio de puesto o agencia",
  rotacion: "Asume funciones temporales",
};

export function getTodayEffectiveDate() {
  return format(new Date(), "yyyy-MM-dd");
}
