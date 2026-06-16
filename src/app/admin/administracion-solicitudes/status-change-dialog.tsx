import { CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";

import type { MiAccesoRequestStatus } from "@/app/admin/mis-solicitudes/mi-acceso.types";
import { MiAccesoStatusBadge } from "@/app/admin/mis-solicitudes/mi-acceso-status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { UpdateAccessRequestStatus } from "@/interfaces/mi-acceso.interfaces";

const STATUS_OPTIONS: Array<{
  status: UpdateAccessRequestStatus;
  label: string;
  variant: "secondary" | "destructive" | "custom2";
  icon: typeof Clock3;
}> = [
  {
    status: "en_proceso",
    label: "En proceso",
    variant: "secondary",
    icon: Clock3,
  },
  {
    status: "rechazado",
    label: "Rechazado",
    variant: "destructive",
    icon: XCircle,
  },
  {
    status: "aprobado",
    label: "Aprobado",
    variant: "custom2",
    icon: CheckCircle2,
  },
];

interface StatusChangeDialogRequest {
  code: string;
  status: MiAccesoRequestStatus;
}

interface MiAccesoStatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: StatusChangeDialogRequest | null;
  isPending?: boolean;
  pendingStatus?: UpdateAccessRequestStatus | null;
  onChangeStatus: (status: UpdateAccessRequestStatus) => void;
}

export function MiAccesoStatusChangeDialog({
  open,
  onOpenChange,
  request,
  isPending = false,
  pendingStatus = null,
  onChangeStatus,
}: MiAccesoStatusChangeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar estado de la solicitud</DialogTitle>
          <DialogDescription>
            {request ? `Seleccioná el nuevo estado para ${request.code}.` : "Seleccioná el nuevo estado de la solicitud."}
          </DialogDescription>
        </DialogHeader>

        {request ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">{request.code}</p>
                  <p className="text-sm text-muted-foreground">Estado actual</p>
                </div>
                <MiAccesoStatusBadge status={request.status} />
              </div>
            </div>

            <div className="grid gap-3">
              {STATUS_OPTIONS.map(({ status, label, variant, icon: Icon }) => {
                const isCurrentStatus = request.status === status;
                const isSubmittingCurrentOption = isPending && pendingStatus === status;

                return (
                  <Button
                    key={status}
                    type="button"
                    variant={variant}
                    className="justify-between"
                    disabled={isPending || isCurrentStatus}
                    onClick={() => onChangeStatus(status)}
                  >
                    <span className="flex items-center gap-2">
                      {isSubmittingCurrentOption ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Icon data-icon="inline-start" aria-hidden="true" />
                      )}
                      {label}
                    </span>
                    {isCurrentStatus ? <span className="text-xs opacity-80">Actual</span> : null}
                  </Button>
                );
              })}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
