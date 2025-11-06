import { Session } from "@/interfaces/sessions.interfaces";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Loader2, LogOut } from "lucide-react";
import { SessionItem } from "./session-item";
import { Separator } from "@/components/ui/separator";

interface AplicativoSessionsGroupProps {
  aplicativoId: number;
  aplicativoNombre: string;
  sessions: Session[];
  onCloseSession: (sessionId: number) => void;
  onCloseAllSessions: (sessionIds: number[]) => void;
  isLoadingSession?: number;
  isLoadingAll?: boolean;
}

export const AplicativoSessionsGroup = ({
  aplicativoId: _aplicativoId,
  aplicativoNombre,
  sessions,
  onCloseSession,
  onCloseAllSessions,
  isLoadingSession,
  isLoadingAll = false,
}: AplicativoSessionsGroupProps) => {
  const sessionIds = sessions.map((s) => s.id);

  const handleCloseAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoadingAll && sessionIds.length > 0) {
      onCloseAllSessions(sessionIds);
    }
  };

  return (
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
              isLoading={isLoadingSession === session.id}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

