"use client"

import type { ActionType } from "@/lib/movements-data"
import { ACTION_LABELS } from "@/lib/movements-data"
import { ArrowRightLeft, RefreshCw, UserMinus, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

const styles: Record<
  ActionType,
  { container: string; icon: React.ComponentType<{ className?: string }> }
> = {
  alta: {
    container: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
    icon: UserPlus,
  },
  baja: {
    container: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20",
    icon: UserMinus,
  },
  movimiento: {
    container: "bg-sky-50 text-sky-700 ring-1 ring-sky-600/20",
    icon: ArrowRightLeft,
  },
  rotacion: {
    container: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/20",
    icon: RefreshCw,
  },
}

export function ActionBadge({
  type,
  className,
  size = "md",
}: {
  type: ActionType
  className?: string
  size?: "sm" | "md"
}) {
  const { container, icon: Icon } = styles[type]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        container,
        className,
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
      {ACTION_LABELS[type]}
    </span>
  )
}
