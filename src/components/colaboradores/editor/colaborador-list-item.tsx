import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Result } from "@/interfaces/colaboradores.interfaces";

interface ColaboradorListItemProps {
  colaborador: Result;
  isActive: boolean;
  onSelect: (id: number) => void;
}

export const ColaboradorListItem = ({ colaborador, isActive, onSelect }: ColaboradorListItemProps) => {
  const initials = colaborador.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CL";

  return (
    <button
      type="button"
      onClick={() => onSelect(colaborador.id)}
      className={cn(
        "w-full rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "border-primary/40 bg-primary/5 shadow-sm"
          : "border-border bg-background hover:border-primary/20 hover:bg-muted/40",
      )}
      aria-current={isActive ? "true" : undefined}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-10 shrink-0 border">
          <AvatarImage src={colaborador.picture ?? undefined} alt={colaborador.name} loading="lazy" decoding="async" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 text-sm font-medium text-foreground">{colaborador.name}</p>
            <Badge
              variant="secondary"
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase",
                colaborador.is_active
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
              )}
            >
              {colaborador.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          <p className="mt-1 truncate text-xs text-muted-foreground">@{colaborador.username}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {colaborador.agency?.name} · {colaborador.role?.role}
          </p>

          <div className="mt-2 flex flex-wrap gap-1">
            {colaborador.is_staff && (
              <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px]">
                Staff
              </Badge>
            )}
            {colaborador.is_superuser && (
              <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px]">
                Superuser
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
