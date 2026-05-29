export type MovementApiType = "alta" | "baja" | "movimiento" | "rotacion";
export type MovementLogType = "ALTA" | "BAJA" | "MOVIMIENTO" | "ROTACION";
export type MovementTypeFilter = MovementLogType | "ALL";
export type MovementListTypeFilter = MovementLogType[];

export interface MovementApiAssignment {
  agency_id?: number;
  role_id?: number;
}

export interface MovementApiCollaborator {
  nombre: string;
  username: string;
  email: string;
  password: string;
  dpi: string;
  cif: string;
  agency_id: number;
  role_id: number;
}

export interface CreateMovementPayload {
  tipo: MovementApiType;
  fecha: string;
  observaciones?: string;
  colaborador_id?: number;
  current?: MovementApiAssignment;
  new?: MovementApiAssignment;
  colaborador?: MovementApiCollaborator;
}

export interface MovementUserBasic {
  id?: number;
  name: string;
  username: string;
}

export interface MovementAssignmentDisplay {
  agency?: string;
  role?: string;
  fallbackText?: string;
}

export interface MovementLogApi {
  id: number;
  tipo_accion: MovementLogType;
  fecha_accion: string;
  current_value?: unknown;
  new_value?: unknown;
  affected_user?: MovementUserBasic | null;
  comment?: string | null;
  created_by?: MovementUserBasic | null;
  is_apply: boolean;
}

export interface MovementLogRow {
  id: number;
  tipoAccion: MovementLogType;
  fechaAccion: string;
  currentAssignment: MovementAssignmentDisplay;
  newAssignment: MovementAssignmentDisplay;
  currentValue: string;
  newValue: string;
  affectedUserName: string;
  affectedUsername: string;
  createdByName: string;
  createdByUsername: string;
  comment: string;
  isApply: boolean;
}

export interface GetMovementsParams {
  fecha_inicio: string;
  fecha_fin: string;
  tipo?: MovementLogType | MovementLogType[];
}

export interface MovementReportEmailPayload {
  fecha_inicio: string;
  fecha_fin: string;
  colaborador_ids: number[];
  tipo?: MovementLogType[];
}
