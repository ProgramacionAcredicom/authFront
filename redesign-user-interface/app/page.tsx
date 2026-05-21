"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MovementCard } from "@/components/movement-card"
import { initialMovements, type Movement, ACTION_LABELS, type ActionType } from "@/lib/movements-data"
import { CheckCircle2, Plus, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Page() {
  const [movements, setMovements] = useState<Movement[]>(initialMovements)

  const handleChange = (idx: number, m: Movement) =>
    setMovements((prev) => prev.map((x, i) => (i === idx ? m : x)))

  const handleRemove = (idx: number) =>
    setMovements((prev) => prev.filter((_, i) => i !== idx))

  const handleAddWithType = (actionType: ActionType) =>
    setMovements((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        actionType,
        effectiveDate: "",
        collaborator: null,
        observations: "",
      },
    ])

  return (
    <main className="min-h-svh bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              Gestión de movimientos de personal
            </h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Registra altas, bajas, movimientos y rotaciones. Todos los cambios se
              aplicarán en la fecha efectiva indicada.
            </p>
          </div>
          <div
            className="rounded-lg border bg-card px-3 py-2 text-sm shadow-sm"
            aria-live="polite"
          >
            <span className="text-muted-foreground">Movimientos pendientes: </span>
            <span className="font-semibold text-foreground">{movements.length}</span>
          </div>
        </div>

        {/* Movement list */}
        <div className="space-y-4">
          {movements.map((m, i) => (
            <MovementCard
              key={m.id}
              index={i}
              movement={m}
              onChange={(next) => handleChange(i, next)}
              onRemove={() => handleRemove(i)}
            />
          ))}

          {movements.length === 0 && (
            <div className="rounded-xl border border-dashed bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No hay movimientos registrados.
              </p>
            </div>
          )}
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-4 mt-8 rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur supports-backdrop-filter:bg-card/80">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Revisa los movimientos antes de confirmar. Esta acción notificará a las
              áreas correspondientes.
            </p>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Añadir movimiento
                    <ChevronDown className="h-4 w-4 ml-1" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {(Object.keys(ACTION_LABELS) as ActionType[]).map((actionType) => (
                    <DropdownMenuItem
                      key={actionType}
                      onClick={() => handleAddWithType(actionType)}
                      className="cursor-pointer"
                    >
                      {ACTION_LABELS[actionType]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="button">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Confirmar {movements.length} movimiento
                {movements.length === 1 ? "" : "s"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
