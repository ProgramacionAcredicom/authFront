import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { getMiAccesoStatusLabel } from "./mi-acceso.utils";
import type { MiAccesoRequestStatus } from "./mi-acceso.types";

const statusClasses: Record<MiAccesoRequestStatus, string> = {
  registrado: "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200",
  en_proceso: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-200",
  aprobado: "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200",
  rechazado: "border-transparent bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200",
};

interface MiAccesoStatusBadgeProps {
  status: MiAccesoRequestStatus;
}

export function MiAccesoStatusBadge({ status }: MiAccesoStatusBadgeProps) {
  return <Badge className={cn(statusClasses[status])}>{getMiAccesoStatusLabel(status)}</Badge>;
}
