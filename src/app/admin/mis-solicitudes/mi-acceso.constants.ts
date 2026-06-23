import type { MiAccesoRequestStatus, MiAccesoRequestType } from "./mi-acceso.types";

export const MI_ACCESO_FIXED_SYSTEMS = [
  "T24",
  "Evolution",
  "Módulo de garantías",
  "Herramienta agrícola",
  "Workflow",
  "Registro de tarjeta de crédito",
  "Cabinet",
  "Bankworks",
  "Seguros",
  "MCENLINEA",
] as const;

export const MI_ACCESO_TYPE_LABELS: Record<MiAccesoRequestType, string> = {
  alta: "Alta",
  baja: "Baja",
  vacaciones: "Vacaciones",
  nuevo_permiso: "Nuevo permiso",
};

export function canDownloadMiAccesoRequestPdf(type: MiAccesoRequestType) {
  return type === "alta" || type === "baja";
}

export const MI_ACCESO_STATUS_LABELS: Record<MiAccesoRequestStatus, string> = {
  registrado: "Registrado",
  en_proceso: "En proceso",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};
