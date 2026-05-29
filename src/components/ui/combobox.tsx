"use client";

import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

const Combobox = ComboboxPrimitive.Root;

function ComboboxValue(props: React.ComponentProps<typeof ComboboxPrimitive.Value>) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> &
  Pick<React.ComponentProps<typeof ComboboxPrimitive.Positioner>, "side" | "align" | "sideOffset" | "alignOffset" | "anchor">) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "w-(--anchor-width) max-w-(--available-width) min-w-[16rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95 data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("px-3 py-2 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function ComboboxList({ className, ...props }: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn("max-h-80 overflow-y-auto p-1", className)}
      {...props}
    />
  );
}

function ComboboxItem({ className, children, ...props }: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center text-muted-foreground">
        <Check className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

const ComboboxChips = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Chips>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Chips>
>(({ className, ...rest }, ref) => {
  return (
    <ComboboxPrimitive.Chips
      ref={ref}
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors focus-within:outline-hidden focus-within:ring-1 focus-within:ring-ring has-aria-invalid:ring-destructive/20 dark:bg-input/30",
        className,
      )}
      {...rest}
    />
  );
});
ComboboxChips.displayName = "ComboboxChips";

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chip> & { showRemove?: boolean }) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-7 max-w-full items-center gap-1 rounded-md border bg-muted px-2 text-xs font-medium text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          data-slot="combobox-chip-remove"
          className="inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <X className="size-3" />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput(props: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "min-w-24 flex-1 bg-transparent px-1 py-1 text-sm text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
};
