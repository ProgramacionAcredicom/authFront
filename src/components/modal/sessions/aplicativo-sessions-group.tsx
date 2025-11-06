import { Session } from "@/interfaces/sessions.interfaces";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Loader2, LogOut } from "lucide-react";
import { SessionItem } from "./session-item";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface AplicativoSessionsGroupProps {
  aplicativoId: number;
  aplicativoNombre: string;
  sessions: Session[];
  onCloseSession: (sessionId: number) => void;
  onCloseAllSessions: (sessionIds: number[]) => void;
  loadingSessionIds: Set<number>;
  isLoadingAll?: boolean;
}

export const AplicativoSessionsGroup = ({
  aplicativoId,
  aplicativoNombre,
  sessions,
  onCloseSession,
  onCloseAllSessions,
  loadingSessionIds,
  isLoadingAll = false,
}: AplicativoSessionsGroupProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const sessionIds = sessions.map((s) => s.id);

  const handleCloseAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoadingAll && sessionIds.length > 0) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmCloseAll = () => {
    setShowConfirmDialog(false);
    if (sessionIds.length > 0) {
      onCloseAllSessions(sessionIds);
    }
  };

  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 justify-between px-2 py-1.5 h-auto font-semibold"
            >
              <div className="flex items-center gap-2">
                <span>{aplicativoNombre}</span>
                <Badge variant="secondary" className="text-xs">
                  {sessions.length}
                </Badge>
              </div>
              <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </Button>
          </CollapsibleTrigger>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCloseAll}
            disabled={isLoadingAll || sessionIds.length === 0}
            className="shrink-0"
          >
            {isLoadingAll ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Cerrando...
              </>
            ) : (
              <>
                <LogOut className="mr-2 size-4" />
                Cerrar todas
              </>
            )}
          </Button>
        </div>

        <CollapsibleContent>
          <Separator className="my-2" />
          <div className="space-y-1 pl-2">
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                onCloseSession={onCloseSession}
                isLoading={loadingSessionIds.has(session.id)}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cierre de sesiones</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de cerrar todas las sesiones de <strong>{aplicativoNombre}</strong>? Esta acción cerrará {sessionIds.length} sesión(es) activa(s).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoadingAll}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCloseAll}
              disabled={isLoadingAll}
            >
              {isLoadingAll ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

