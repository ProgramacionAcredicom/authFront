import type { MiAccesoRequest } from "./mi-acceso.types";

const SAMPLE_COLLABORATOR = {
  id: 101,
  name: "Carlos Estuardo Alvarado",
  username: "calvarado",
  position: "Asesor de Microcrédito",
  area: "Microcrédito",
  agency: "Central",
  email: "calvarado@acredicom.com.gt",
  isActive: true,
} as const;

const SAMPLE_MANAGER = {
  id: 205,
  name: "Mónica Herrera",
  username: "mherrera",
  position: "Gerente de agencia",
  area: "Operaciones",
  agency: "Central",
  email: "mherrera@acredicom.com.gt",
  isActive: true,
} as const;

const SAMPLE_REFERENCE = {
  id: 302,
  name: "Ramiro Lopez",
  username: "rlopez",
  position: "Analista Programador",
  area: "Tecnología",
  agency: "Central",
  email: "rlopez@acredicom.com.gt",
  isActive: true,
} as const;

export function getInitialMiAccesoRequests(): MiAccesoRequest[] {
  return [
    {
      id: "mi-acceso-seed-001",
      code: "REQ-2026-001",
      type: "alta",
      collaborator: SAMPLE_COLLABORATOR,
      manager: SAMPLE_MANAGER,
      systems: [
        {
          systemName: "T24",
          reference: SAMPLE_REFERENCE,
          observation: "Tomar permisos base del usuario de referencia.",
        },
      ],
      customSystems: [],
      additionalRequirement: "Crear accesos iniciales para inducción.",
      status: "aprobado",
      createdAt: "2026-06-01T09:00:00.000Z",
      pdfAvailable: false,
    },
    {
      id: "mi-acceso-seed-002",
      code: "REQ-2026-002",
      type: "baja",
      collaborator: {
        id: 102,
        name: "Andrea Paz",
        username: "apaz",
        position: "Analista de cartera",
        area: "Créditos",
        agency: "Norte",
        email: "apaz@acredicom.com.gt",
        isActive: true,
      },
      manager: SAMPLE_MANAGER,
      systems: [
        {
          systemName: "Seguros",
          reference: SAMPLE_REFERENCE,
          observation: "Revocar acceso al cierre del día.",
        },
      ],
      customSystems: [],
      additionalRequirement: "",
      status: "registrado",
      createdAt: "2026-06-03T11:45:00.000Z",
      pdfAvailable: false,
    },
  ];
}
