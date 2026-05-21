export type ActionType = "alta" | "baja" | "movimiento" | "rotacion"

export interface CollaboratorInfo {
  name: string
  agency: string
  position: string
  username?: string
  email?: string
  executive?: string
  password?: string
}

export interface Movement {
  id: string
  actionType: ActionType
  effectiveDate: string
  collaborator: CollaboratorInfo | null
  // For "alta" we capture new data
  newName?: string
  newDpi?: string
  newId?: string
  newAgency?: string
  newPosition?: string
  observations: string
}

export const ACTION_LABELS: Record<ActionType, string> = {
  alta: "Alta",
  baja: "Baja",
  movimiento: "Movimiento",
  rotacion: "Rotación",
}

export const ACTION_DESCRIPTIONS: Record<ActionType, string> = {
  alta: "Ingreso de un nuevo colaborador",
  baja: "Salida de un colaborador",
  movimiento: "Cambio de puesto o agencia",
  rotacion: "Asume funciones temporales",
}

export const initialMovements: Movement[] = [
  {
    id: "m1",
    actionType: "alta",
    effectiveDate: "",
    collaborator: null,
    newAgency: "Tejutla",
    newPosition: "Atención al público",
    observations: "",
  },
  {
    id: "m2",
    actionType: "baja",
    effectiveDate: "",
    collaborator: {
      name: "Danilo Calderón",
      agency: "Tejutla",
      position: "Atención al público",
      username: "mcusuario",
      email: "zarate@gmail.com",
      executive: "Juan Pérez",
    },
    observations: "Por despido",
  },
  {
    id: "m3",
    actionType: "movimiento",
    effectiveDate: "",
    collaborator: {
      name: "Danilo Calderón",
      agency: "Tejutla",
      position: "Atención al público",
    },
    newAgency: "Tejutla",
    newPosition: "Atención al público",
    observations: "Ascenso | Cambio de puesto",
  },
  {
    id: "m4",
    actionType: "rotacion",
    effectiveDate: "",
    collaborator: {
      name: "Danilo Calderón",
      agency: "Tejutla",
      position: "Atención al público",
    },
    observations: "Toma funciones de Atención al asociado",
  },
]

export const AGENCIES = ["Tejutla", "San Marcos", "Quetzaltenango", "Huehuetenango"]
export const POSITIONS = [
  "Atención al público",
  "Atención al asociado",
  "Cajero",
  "Ejecutivo de cuenta",
  "Supervisor",
]
export const COLLABORATORS = [
  { name: "Danilo Calderón", agency: "Tejutla", position: "Atención al público" },
  { name: "María López", agency: "San Marcos", position: "Cajero" },
  { name: "Carlos Méndez", agency: "Quetzaltenango", position: "Supervisor" },
]
