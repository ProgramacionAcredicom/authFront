import type { AgenciasModelTypes } from "@/interfaces/agencias.interfaces";
import type { RolesModelType } from "@/interfaces/roles.interfaces";
import type { CreateMovementPayload, MovementApiAssignment } from "@/interfaces/movements.interfaces";
import { splitName } from "@/lib/splitName";

import { ACTION_LABELS, type ActionType, type Movement, type MovementValidationErrors } from "./movements-data";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N");
}

export function generateCredentialsFromName(fullName: string) {
  const { name, middleName, lastName } = splitName(fullName.trim());

  if (!name || !middleName || !lastName) {
    return { email: "", username: "" };
  }

  const firstInitial = name.charAt(0).toLowerCase();
  const secondInitial = middleName.charAt(0).toLowerCase();
  const normalizedLastName = normalizeString(lastName.toLowerCase().replace(/\s+/g, ""));

  return {
    email: `${firstInitial}${secondInitial}${normalizedLastName}@acredicom.com.gt`,
    username: `mc${firstInitial}${secondInitial}${normalizedLastName}`,
  };
}

export function buildMovementSummary(movements: Movement[]) {
  const totals = movements.reduce<Record<ActionType, number>>(
    (accumulator, movement) => {
      accumulator[movement.actionType] += 1;
      return accumulator;
    },
    {
      alta: 0,
      baja: 0,
      movimiento: 0,
      rotacion: 0,
    },
  );

  return (Object.keys(totals) as ActionType[])
    .filter((key) => totals[key] > 0)
    .map((key) => `${ACTION_LABELS[key]}: ${totals[key]}`)
    .join(" · ");
}

export function validateMovement(movement: Movement): MovementValidationErrors {
  const errors: MovementValidationErrors = {};

  if (!movement.effectiveDate) {
    errors.effectiveDate = "La fecha efectiva es requerida.";
  }

  if (movement.actionType === "alta") {
    if (!movement.newName?.trim()) {
      errors.newName = "El nombre completo es requerido.";
    }

    if (!movement.newDpi?.trim()) {
      errors.newDpi = "El DPI es requerido.";
    } else if (movement.newDpi.length !== 13) {
      errors.newDpi = "El DPI debe contener exactamente 13 dígitos numéricos.";
    }

    if (!movement.newId?.trim()) {
      errors.newId = "El ID de empleado es requerido.";
    }

    if (!movement.newUsername?.trim()) {
      errors.newUsername = "El username es requerido.";
    }

    if (!movement.newEmail?.trim()) {
      errors.newEmail = "El correo es requerido.";
    } else if (!EMAIL_REGEX.test(movement.newEmail.trim())) {
      errors.newEmail = "El correo debe ser válido.";
    }

    if (!movement.newPassword?.trim()) {
      errors.newPassword = "La contraseña es requerida.";
    }

    if (!movement.newConfirmPassword?.trim()) {
      errors.newConfirmPassword = "La confirmación de contraseña es requerida.";
    } else if (movement.newPassword !== movement.newConfirmPassword) {
      errors.newConfirmPassword = "Las contraseñas no coinciden.";
    }

    if (!movement.newAgency?.trim()) {
      errors.newAgency = "La agencia es requerida.";
    }

    if (!movement.newPosition?.trim()) {
      errors.newPosition = "El puesto es requerido.";
    }
  }

  if (movement.actionType === "baja" && !movement.collaborator) {
    errors.collaborator = "Selecciona un colaborador.";
  }

  if (movement.actionType === "movimiento") {
    if (!movement.collaborator) {
      errors.collaborator = "Selecciona un colaborador.";
    }

    if (!movement.newAgency?.trim()) {
      errors.newAgency = "La agencia es requerida.";
    }

    if (!movement.newPosition?.trim()) {
      errors.newPosition = "El puesto es requerido.";
    }
  }

  if (movement.actionType === "rotacion") {
    if (!movement.collaborator) {
      errors.collaborator = "Selecciona un colaborador.";
    }

    if (!movement.newAgency?.trim()) {
      errors.newAgency = "La agencia es requerida.";
    }
  }

  return errors;
}

export function buildValidationMap(movements: Movement[]) {
  return movements.reduce<Record<string, MovementValidationErrors>>((accumulator, movement) => {
    const errors = validateMovement(movement);

    if (Object.keys(errors).length > 0) {
      accumulator[movement.id] = errors;
    }

    return accumulator;
  }, {});
}

interface SerializeMovementsOptions {
  agencies: Pick<AgenciasModelTypes, "id" | "name">[];
  roles: Pick<RolesModelType, "id" | "role">[];
}

function cleanAssignment(assignment: MovementApiAssignment) {
  return Object.fromEntries(
    Object.entries(assignment).filter(([, value]) => typeof value === "number"),
  ) as MovementApiAssignment;
}

function resolveAgencyId(agencyName: string | undefined, agencies: Pick<AgenciasModelTypes, "id" | "name">[]) {
  if (!agencyName?.trim()) {
    return undefined;
  }

  return agencies.find((agency) => agency.name === agencyName)?.id;
}

function resolveRoleId(roleName: string | undefined, roles: Pick<RolesModelType, "id" | "role">[]) {
  if (!roleName?.trim()) {
    return undefined;
  }

  return roles.find((role) => role.role === roleName)?.id;
}

function ensureId(value: number | undefined, message: string) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

function getCurrentAssignment(
  movement: Movement,
  agencies: Pick<AgenciasModelTypes, "id" | "name">[],
  roles: Pick<RolesModelType, "id" | "role">[],
) {
  const agencyId = movement.collaborator?.agencyId ?? resolveAgencyId(movement.collaborator?.agency, agencies);
  const roleId = movement.collaborator?.roleId ?? resolveRoleId(movement.collaborator?.position, roles);

  return cleanAssignment({
    agency_id: agencyId,
    role_id: roleId,
  });
}

function getNewAssignment(
  movement: Movement,
  agencies: Pick<AgenciasModelTypes, "id" | "name">[],
  roles: Pick<RolesModelType, "id" | "role">[],
) {
  const agencyId = ensureId(
    resolveAgencyId(movement.newAgency, agencies),
    `No se pudo resolver la agencia "${movement.newAgency ?? ""}".`,
  );

  const roleId = movement.actionType === "rotacion"
    ? undefined
    : ensureId(
        resolveRoleId(movement.newPosition, roles),
        `No se pudo resolver el puesto "${movement.newPosition ?? ""}".`,
      );

  return cleanAssignment({
    agency_id: agencyId,
    role_id: roleId,
  });
}

export function serializeMovement(
  movement: Movement,
  { agencies, roles }: SerializeMovementsOptions,
): CreateMovementPayload {
  if (movement.actionType === "alta") {
    const agencyId = ensureId(
      resolveAgencyId(movement.newAgency, agencies),
      `No se pudo resolver la agencia "${movement.newAgency ?? ""}".`,
    );
    const roleId = ensureId(
      resolveRoleId(movement.newPosition, roles),
      `No se pudo resolver el puesto "${movement.newPosition ?? ""}".`,
    );

    return {
      tipo: movement.actionType,
      fecha: movement.effectiveDate,
      observaciones: movement.observations.trim() || undefined,
      colaborador: {
        nombre: movement.newName?.trim() ?? "",
        username: movement.newUsername?.trim() ?? "",
        email: movement.newEmail?.trim() ?? "",
        password: movement.newPassword?.trim() ?? "",
        dpi: movement.newDpi?.trim() ?? "",
        cif: movement.newId?.trim() ?? "",
        agency_id: agencyId,
        role_id: roleId,
      },
    };
  }

  const collaboratorId = ensureId(
    movement.collaborator?.id,
    "No se pudo resolver el colaborador seleccionado.",
  );

  const basePayload: CreateMovementPayload = {
    tipo: movement.actionType,
    fecha: movement.effectiveDate,
    observaciones: movement.observations.trim() || undefined,
    colaborador_id: collaboratorId,
  };

  const currentAssignment = getCurrentAssignment(movement, agencies, roles);
  if (Object.keys(currentAssignment).length > 0) {
    basePayload.current = currentAssignment;
  }

  if (movement.actionType === "movimiento" || movement.actionType === "rotacion") {
    basePayload.new = getNewAssignment(movement, agencies, roles);
  }

  return basePayload;
}

export function serializeMovementsPayload(
  movements: Movement[],
  options: SerializeMovementsOptions,
) {
  return movements.map((movement) => serializeMovement(movement, options));
}
