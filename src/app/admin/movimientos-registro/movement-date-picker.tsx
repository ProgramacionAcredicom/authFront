"use client";

import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function toDate(value: string) {
  if (!value) {
    return undefined;
  }

  return parseISO(value);
}

function toIsoDate(value: Date | undefined) {
  if (!value) {
    return "";
  }

  return format(value, "yyyy-MM-dd");
}

export function MovementDatePicker({
  id,
  value,
  onChange,
  className,
  ariaLabel,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}) {
  const selectedDate = toDate(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          className={cn("w-full justify-between font-normal", !selectedDate && "text-muted-foreground", className)}
        >
          <span className="truncate">
            {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Selecciona una fecha"}
          </span>
          <CalendarIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => onChange(toIsoDate(date))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
