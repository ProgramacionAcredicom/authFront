"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchableSelect } from "@/components/searchable-select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Building2, Briefcase, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { ActionBadge } from "@/components/action-badge"
import {
  AGENCIES,
  COLLABORATORS,
  POSITIONS,
  type Movement,
} from "@/lib/movements-data"
import { Trash2 } from "lucide-react"

interface MovementCardProps {
  index: number
  movement: Movement
  onChange: (m: Movement) => void
  onRemove: () => void
}

export function MovementCard({ index, movement, onChange, onRemove }: MovementCardProps) {
  const isAlta = movement.actionType === "alta"
  const showAssignment = isAlta || movement.actionType === "movimiento"
  const [openCollabPopover, setOpenCollabPopover] = React.useState(false)

  const update = (patch: Partial<Movement>) => onChange({ ...movement, ...patch })

  return (
    <article
      className="group relative rounded-xl border bg-card shadow-sm transition-shadow focus-within:shadow-md"
      aria-labelledby={`movement-${movement.id}-title`}
    >
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground"
            aria-hidden="true"
          >
            {index + 1}
          </span>

          {!isAlta && (
            <Popover open={openCollabPopover} onOpenChange={setOpenCollabPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCollabPopover}
                  className="justify-between md:w-56"
                >
                  {movement.collaborator?.name ?? "Seleccionar colaborador"}
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar colaborador..." />
                  <CommandEmpty>Sin resultados.</CommandEmpty>
                  <CommandGroup>
                    {COLLABORATORS.map((c) => (
                      <CommandItem
                        key={c.name}
                        value={c.name}
                        onSelect={() => {
                          update({ collaborator: c })
                          setOpenCollabPopover(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 mr-2",
                            movement.collaborator?.name === c.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                          aria-hidden="true"
                        />
                        {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          <ActionBadge type={movement.actionType} size="sm" />

          {!isAlta && movement.collaborator && (
            <div
              className="hidden items-center gap-3 border-l pl-3 text-xs text-muted-foreground sm:flex"
              aria-label="Asignación actual del colaborador"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                Asignación actual
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                <span className="font-medium text-foreground/80">
                  {movement.collaborator.agency}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                <span className="font-medium text-foreground/80">
                  {movement.collaborator.position}
                </span>
              </span>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Descartar movimiento ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span className="ml-1.5">Descartar</span>
        </Button>
      </header>

      {/* Body */}
      {isAlta ? (
        <div className="grid gap-6 p-5 md:grid-cols-2">
          {/* Column 1: Fecha + Nombre + DPI */}
          <fieldset className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`date-${movement.id}`}>
                Fecha efectiva <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`date-${movement.id}`}
                type="date"
                value={movement.effectiveDate}
                onChange={(e) => update({ effectiveDate: e.target.value })}
                aria-describedby={`date-help-${movement.id}`}
              />
              <p id={`date-help-${movement.id}`} className="text-xs text-muted-foreground">
                Fecha en la que tomará efecto el cambio.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`name-${movement.id}`}>
                Nombre completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`name-${movement.id}`}
                placeholder="Ej. Juan Pérez"
                value={movement.newName ?? ""}
                onChange={(e) => update({ newName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`dpi-${movement.id}`}>
                DPI <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`dpi-${movement.id}`}
                inputMode="numeric"
                placeholder="0000 00000 0000"
                value={movement.newDpi ?? ""}
                onChange={(e) => update({ newDpi: e.target.value })}
              />
            </div>
          </fieldset>

          {/* Column 2: ID + Agencia + Puesto */}
          <fieldset className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`empid-${movement.id}`}>ID de empleado</Label>
              <Input
                id={`empid-${movement.id}`}
                placeholder="Ej. EMP-0123"
                value={movement.newId ?? ""}
                onChange={(e) => update({ newId: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`agency-${movement.id}`}>
                Agencia <span className="text-destructive">*</span>
              </Label>
              <SearchableSelect
                id={`agency-${movement.id}`}
                value={movement.newAgency ?? ""}
                onChange={(v) => update({ newAgency: v })}
                options={AGENCIES}
                placeholder="Selecciona una agencia"
                searchPlaceholder="Buscar agencia…"
                emptyMessage="Sin agencias."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`position-${movement.id}`}>
                Puesto <span className="text-destructive">*</span>
              </Label>
              <SearchableSelect
                id={`position-${movement.id}`}
                value={movement.newPosition ?? ""}
                onChange={(v) => update({ newPosition: v })}
                options={POSITIONS}
                placeholder="Selecciona un puesto"
                searchPlaceholder="Buscar puesto…"
                emptyMessage="Sin puestos."
              />
            </div>
          </fieldset>

          {/* Row below: Observaciones full width */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`obs-${movement.id}`}>
                Observaciones
              </Label>
            </div>
            <Textarea
              id={`obs-${movement.id}`}
              rows={3}
              maxLength={300}
              placeholder="Agrega contexto sobre este movimiento…"
              value={movement.observations}
              onChange={(e) => update({ observations: e.target.value })}
              aria-describedby={`obs-help-${movement.id}`}
            />
            <p
              id={`obs-help-${movement.id}`}
              className="text-right text-xs text-muted-foreground"
            >
              {movement.observations.length}/300
            </p>
          </div>
        </div>
      ) : showAssignment ? (
        <div className="grid gap-6 p-5 md:grid-cols-3">
          {/* Column 1: Fecha */}
          <div className="space-y-1.5">
            <Label htmlFor={`date-${movement.id}`}>
              Fecha efectiva <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`date-${movement.id}`}
              type="date"
              value={movement.effectiveDate}
              onChange={(e) => update({ effectiveDate: e.target.value })}
              aria-describedby={`date-help-${movement.id}`}
            />
            <p id={`date-help-${movement.id}`} className="text-xs text-muted-foreground">
              Fecha en la que tomará efecto el cambio.
            </p>
          </div>

          {/* Column 2: Agencia */}
          <div className="space-y-1.5">
            <Label htmlFor={`agency-${movement.id}`}>
              Asignar Agencia <span className="text-destructive">*</span>
            </Label>
            <SearchableSelect
              id={`agency-${movement.id}`}
              value={movement.newAgency ?? ""}
              onChange={(v) => update({ newAgency: v })}
              options={AGENCIES}
              placeholder="Selecciona una agencia"
              searchPlaceholder="Buscar agencia…"
              emptyMessage="Sin agencias."
            />
          </div>

          {/* Column 3: Puesto */}
          <div className="space-y-1.5">
            <Label htmlFor={`position-${movement.id}`}>
              Puesto <span className="text-destructive">*</span>
            </Label>
            <SearchableSelect
              id={`position-${movement.id}`}
              value={movement.newPosition ?? ""}
              onChange={(v) => update({ newPosition: v })}
              options={POSITIONS}
              placeholder="Selecciona un puesto"
              searchPlaceholder="Buscar puesto…"
              emptyMessage="Sin puestos."
            />
          </div>

          {/* Row below: Observaciones full width */}
          <div className="space-y-1.5 md:col-span-3">
            <div className="flex items-center justify-between">
              <Label htmlFor={`obs-${movement.id}`}>
                Observaciones
              </Label>
            </div>
            <Textarea
              id={`obs-${movement.id}`}
              rows={3}
              maxLength={300}
              placeholder="Agrega contexto sobre este movimiento…"
              value={movement.observations}
              onChange={(e) => update({ observations: e.target.value })}
              aria-describedby={`obs-help-${movement.id}`}
            />
            <p
              id={`obs-help-${movement.id}`}
              className="text-right text-xs text-muted-foreground"
            >
              {movement.observations.length}/300
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 p-5 md:grid-cols-2">
          {/* Section: Acción */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor={`date-${movement.id}`}>
                Fecha efectiva <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`date-${movement.id}`}
                type="date"
                value={movement.effectiveDate}
                onChange={(e) => update({ effectiveDate: e.target.value })}
                aria-describedby={`date-help-${movement.id}`}
              />
              <p id={`date-help-${movement.id}`} className="text-xs text-muted-foreground">
                Fecha en la que tomará efecto el cambio.
              </p>
            </div>
          </div>

          {/* Section: Detalles / Observaciones */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor={`obs-${movement.id}`}>Observaciones</Label>
              </div>
              <Textarea
                id={`obs-${movement.id}`}
                rows={3}
                maxLength={300}
                placeholder="Agrega contexto sobre este movimiento…"
                value={movement.observations}
                onChange={(e) => update({ observations: e.target.value })}
                aria-describedby={`obs-help-${movement.id}`}
              />
              <p
                id={`obs-help-${movement.id}`}
                className="text-right text-xs text-muted-foreground"
              >
                {movement.observations.length}/300
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
