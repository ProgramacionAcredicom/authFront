import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryUserSessions } from "@/hooks/sessions/useQuerySessions";
import { useMutationCloseSessions } from "@/hooks/sessions/useMutationSessions";
import { AplicativoSessionsGroup } from "./aplicativo-sessions-group";
import { useState } from "react";

interface ModalAdminSesionesProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
}

export const ModalAdminSesiones = ({ isOpen, onClose, userId, userName }: ModalAdminSesionesProps) => {
  const { groupedSessions, isLoading, error } = useQueryUserSessions(userId, isOpen);
  const { mutation, isLoading: isClosing } = useMutationCloseSessions();
  const [loadingSessionIds, setLoadingSessionIds] = useState<Set<number>>(new Set());
  const [loadingGroupIds, setLoadingGroupIds] = useState<Set<number>>(new Set());

  const handleCloseSession = async (sessionId: number) => {
    setLoadingSessionIds(prev => new Set(prev).add(sessionId));
    try {
      await mutation.mutateAsync([sessionId]);
    } finally {
      setLoadingSessionIds(prev => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  const handleCloseAllSessions = async (sessionIds: number[]) => {
    const aplicativoId = Object.keys(groupedSessions).find((key) =>
      groupedSessions[Number(key)].some((s) => sessionIds.includes(s.id))
    );
    
    if (aplicativoId) {
      const aplicativoIdNum = Number(aplicativoId);
      setLoadingGroupIds(prev => new Set(prev).add(aplicativoIdNum));
    }
    
    try {
      await mutation.mutateAsync(sessionIds);
    } finally {
      if (aplicativoId) {
        const aplicativoIdNum = Number(aplicativoId);
        setLoadingGroupIds(prev => {
          const next = new Set(prev);
          next.delete(aplicativoIdNum);
          return next;
        });
      }
    }
  };

  const hasSessions = Object.keys(groupedSessions).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent 
        className="sm:max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-custom-gray font-bold">
            Administrar Sesiones - {userName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Gestiona las sesiones activas del usuario
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="flex h-[200px] items-center justify-center rounded-md border bg-muted/10">
              <p className="text-sm text-muted-foreground">
                Error al cargar las sesiones. Por favor, intenta de nuevo.
              </p>
            </div>
          ) : !hasSessions ? (
            <div className="flex h-[200px] items-center justify-center rounded-md border bg-muted/10">
              <p className="text-sm text-muted-foreground">
                No hay sesiones activas para este usuario
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {Object.entries(groupedSessions).map(([aplicativoId, sessions]) => {
                  const aplicativo = sessions[0]?.aplicativo;
                  if (!aplicativo) return null;

                  return (
                    <AplicativoSessionsGroup
                      key={aplicativoId}
                      aplicativoNombre={aplicativo.nombre}
                      sessions={sessions}
                      onCloseSession={handleCloseSession}
                      onCloseAllSessions={handleCloseAllSessions}
                      loadingSessionIds={loadingSessionIds}
                      isLoadingAll={loadingGroupIds.has(Number(aplicativoId)) && isClosing}
                    />
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
