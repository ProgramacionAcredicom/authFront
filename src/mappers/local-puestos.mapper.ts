import {
  PuestoDetail,
  PuestoDetailResponse,
  PuestoListItem,
  PuestoListResponse,
} from "@/interfaces/puestos.interfaces";

const normalizeCount = (value: number | string | null | undefined) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

export const localPuestoListMapper = (puesto: PuestoListResponse): PuestoListItem => ({
  id: puesto.id,
  role: puesto.role,
  state: puesto.state,
  gruposCount: normalizeCount(puesto.grupos_count),
  created_on: puesto.created_on ?? undefined,
  update_at: puesto.update_at ?? undefined,
});

export const localPuestoDetailMapper = (puesto: PuestoDetailResponse): PuestoDetail => ({
  id: puesto.id,
  role: puesto.role,
  state: puesto.state,
  grupos: puesto.grupos?.map((grupo: any) => typeof grupo === 'number' ? grupo : grupo?.id).filter(Boolean) ?? [],
  created_on: puesto.created_on ?? undefined,
  update_at: puesto.update_at ?? undefined,
});
