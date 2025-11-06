import { Session } from "@/interfaces/sessions.interfaces";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { getDeviceIcon, getDeviceColor, formatSessionDate } from "@/lib/session-utils";
import { cn } from "@/lib/utils";

interface SessionItemProps {
  session: Session;
  onCloseSession: (sessionId: number) => void;
  isLoading?: boolean;
}

export const SessionItem = ({ session, onCloseSession, isLoading = false }: SessionItemProps) => {
  const DeviceIcon = getDeviceIcon(session.device_info);
  const deviceColor = getDeviceColor(session.device_info);
  const lastActiveText = formatSessionDate(session.created_at);

  const handleClick = () => {
    if (!isLoading) {
      onCloseSession(session.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors",
        "hover:bg-muted/50",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <Avatar className={cn("size-10 shrink-0", deviceColor)}>
        <AvatarFallback className={cn("text-white", deviceColor)}>
          <DeviceIcon className="size-5" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{session.device_info}</div>
        <div className="text-xs text-muted-foreground truncate">{lastActiveText}</div>
        <div className="text-xs text-muted-foreground/70 truncate">{session.ip_address}</div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        disabled={isLoading}
        aria-label="Cerrar sesión"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <X className="size-4" />
        )}
      </Button>
    </div>
  );
};

