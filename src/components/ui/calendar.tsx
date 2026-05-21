import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, type DropdownProps } from "react-day-picker"
import { es } from "date-fns/locale"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function CalendarDropdown({
  value,
  onChange,
  children,
  className,
  style,
  ...props
}: DropdownProps) {
  const options = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => ({
      value: String(child.props.value),
      label: child.props.children,
    }))

  const selectedValue = value === undefined ? undefined : String(value)
  const triggerClassName =
    props["aria-label"]?.toLowerCase().includes("year") ||
    props["aria-label"]?.toLowerCase().includes("año")
      ? "w-[110px]"
      : "w-[140px]"

  return (
    <div className={className} style={style}>
      <span className="sr-only">{props["aria-label"]}</span>
      <Select
        value={selectedValue}
        onValueChange={(nextValue) =>
          onChange?.({
            target: { value: nextValue } as EventTarget & HTMLSelectElement,
            currentTarget: { value: nextValue } as EventTarget & HTMLSelectElement,
          } as React.ChangeEvent<HTMLSelectElement>)
        }
      >
        <SelectTrigger
          aria-label={props["aria-label"]}
          size="sm"
          className={cn(
            "h-8 rounded-md border border-input bg-background px-2 text-sm shadow-none focus:ring-1 focus:ring-ring",
            triggerClassName
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[80] max-h-80" position="popper">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const currentYear = new Date().getFullYear()

  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      captionLayout="dropdown"
      fromYear={2000}
      toYear={currentYear + 20}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_dropdowns: "flex w-full items-center justify-center gap-2 px-1",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        dropdown: "hidden",
        dropdown_month: "flex",
        dropdown_year: "flex",
        dropdown_icon: "hidden",
        vhidden: "sr-only",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-neutral-500 rounded-md w-8 font-normal text-[0.8rem] dark:text-neutral-400",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-neutral-100 [&:has([aria-selected].day-range-end)]:rounded-r-md dark:[&:has([aria-selected])]:bg-neutral-800",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-neutral-900 aria-selected:text-neutral-50 dark:aria-selected:bg-neutral-50 dark:aria-selected:text-neutral-900",
        day_range_end:
          "day-range-end aria-selected:bg-neutral-900 aria-selected:text-neutral-50 dark:aria-selected:bg-neutral-50 dark:aria-selected:text-neutral-900",
        day_selected:
          "bg-neutral-900 text-neutral-50 hover:bg-neutral-900 hover:text-neutral-50 focus:bg-neutral-900 focus:text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 dark:focus:bg-neutral-50 dark:focus:text-neutral-900",
        day_today: "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
        day_outside:
          "day-outside text-neutral-500 aria-selected:text-neutral-500 dark:text-neutral-400 dark:aria-selected:text-neutral-400",
        day_disabled: "text-neutral-500 opacity-50 dark:text-neutral-400",
        day_range_middle:
          "aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Dropdown: CalendarDropdown,
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
