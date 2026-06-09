import { ArrowRightLeft, RefreshCw, UserMinus, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { ACTION_LABELS, type ActionType } from "./movements-data";

const actionStyles: Record<ActionType, string> = {
  alta: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  baja: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
  movimiento: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
  rotacion: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
};

const actionIcons: Record<ActionType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  alta: UserPlus,
  baja: UserMinus,
  movimiento: ArrowRightLeft,
  rotacion: RefreshCw,
};

export function ActionBadge({
  type,
  className,
  size = "md",
}: {
  type: ActionType;
  className?: string;
  size?: "sm" | "md";
}) {
  const Icon = actionIcons[type];

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        actionStyles[type],
        className,
      )}
    >
      <Icon aria-hidden="true" className="opacity-80" />
      {ACTION_LABELS[type]}
    </Badge>
  );
}
