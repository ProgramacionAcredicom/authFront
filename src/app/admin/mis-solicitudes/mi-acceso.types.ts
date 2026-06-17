export type MiAccesoRequestType = "alta" | "baja" | "vacaciones" | "nuevo_permiso";

export type MiAccesoRequestStatus = "registrado" | "en_proceso" | "aprobado" | "rechazado";

export interface MiAccesoCollaborator {
  id: number;
  name: string;
  username: string;
  position: string;
  area: string;
  agency: string;
  email?: string;
  isActive?: boolean;
}

export interface MiAccesoSystemAccess {
  systemId: number | null;
  systemName: string;
  reference: MiAccesoCollaborator | null;
  observation: string;
}

export interface MiAccesoCustomSystemAccess extends MiAccesoSystemAccess {
  localId: string;
}

export interface MiAccesoRequest {
  id: number | string;
  code: string;
  type: MiAccesoRequestType;
  collaborator: MiAccesoCollaborator;
  manager: MiAccesoCollaborator | null;
  systems: MiAccesoSystemAccess[];
  customSystems: MiAccesoCustomSystemAccess[];
  additionalRequirement: string;
  status: MiAccesoRequestStatus;
  createdAt: string;
  pdfAvailable: boolean;
}

export interface MiAccesoRequestDraft {
  type: MiAccesoRequestType;
  collaborator: MiAccesoCollaborator;
  manager: MiAccesoCollaborator;
  systems: MiAccesoSystemAccess[];
  customSystems: MiAccesoCustomSystemAccess[];
  additionalRequirement: string;
}
