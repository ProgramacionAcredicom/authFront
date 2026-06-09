import type { Table } from "@tanstack/react-table";
import * as React from "react";

import type { MovementListTypeFilter, MovementLogRow, MovementLogType } from "@/interfaces/movements.interfaces";
import { MovementDatePicker } from "@/app/admin/movimientos-registro/movement-date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
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
} from "@/components/ui/combobox";
import { DataTableViewOptions } from "@/components/ui/table/data-table-view-options";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovementTypeOption {
  label: string;
  value: MovementLogType;
}

interface MovimientosTableToolbarProps {
  table: Table<MovementLogRow>;
  filters: {
    fechaInicio: string;
    fechaFin: string;
    tipos: MovementListTypeFilter;
  };
  movementTypeOptions: MovementTypeOption[];
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onTypeChange: (value: MovementListTypeFilter) => void;
}

export function MovimientosTableToolbar({
  table,
  filters,
  movementTypeOptions,
  onFromDateChange,
  onToDateChange,
  onTypeChange,
}: MovimientosTableToolbarProps) {
  const hasGlobalFilter = !!table.getState().globalFilter;
  const typeAnchor = useComboboxAnchor();
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [typeSearch, setTypeSearch] = React.useState("");

  const selectedTypeItems = React.useMemo(
    () => movementTypeOptions.filter((option) => filters.tipos.includes(option.value)),
    [filters.tipos, movementTypeOptions],
  );

  const filterMovementType = React.useCallback((item: MovementTypeOption, query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;
    return item.label.toLowerCase().includes(normalizedQuery);
  }, []);

  return (
    <div role="toolbar" aria-orientation="horizontal" className="flex w-full min-w-0 flex-col gap-2 p-1">
      <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-start lg:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2 xl:flex-row xl:flex-wrap xl:items-end">
          <Input
            placeholder="Buscar colaborador..."
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-full xl:w-[13rem] xl:min-w-[13rem] xl:flex-none"
          />

          <div className="flex w-full flex-col gap-1 xl:w-[11rem] xl:min-w-[11rem] xl:flex-none">
            <span className="text-xs font-medium text-muted-foreground">Inicio</span>
            <MovementDatePicker
              id="movements-toolbar-from"
              value={filters.fechaInicio}
              onChange={onFromDateChange}
              className="h-8 w-full"
              ariaLabel="Fecha inicio"
            />
          </div>

          <div className="flex w-full flex-col gap-1 xl:w-[11rem] xl:min-w-[11rem] xl:flex-none">
            <span className="text-xs font-medium text-muted-foreground">Fin</span>
            <MovementDatePicker
              id="movements-toolbar-to"
              value={filters.fechaFin}
              onChange={onToDateChange}
              className="h-8 w-full"
              ariaLabel="Fecha fin"
            />
          </div>

          <div className="flex w-full min-w-0 flex-col gap-1 xl:min-w-[18rem] xl:flex-1">
            <span className="text-xs font-medium text-muted-foreground">Tipos</span>
            <Combobox
              multiple
              modal={false}
              open={typeOpen}
              onOpenChange={setTypeOpen}
              items={movementTypeOptions}
              value={selectedTypeItems}
              onValueChange={(value) =>
                onTypeChange(Array.isArray(value) ? value.map((item: MovementTypeOption) => item.value) : [])
              }
              inputValue={typeSearch}
              onInputValueChange={setTypeSearch}
              filter={filterMovementType}
              isItemEqualToValue={(item, value) => item.value === value.value}
              itemToStringLabel={(item) => item.label}
              itemToStringValue={(item) => item.value}
            >
              <ComboboxChips ref={typeAnchor} className="min-h-8 w-full gap-1 px-2 py-0.5">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((option: MovementTypeOption) => (
                        <ComboboxChip key={option.value} className="h-6" showRemove>
                          <span className="max-w-24 truncate">{option.label}</span>
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        aria-label="Tipo de movimiento"
                        placeholder={values.length === 0 ? "Todos los tipos" : "Buscar tipo..."}
                        className={cn("py-0.5", values.length === 0 && "min-w-0")}
                      />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>

              <ComboboxContent anchor={typeAnchor} className="w-full">
                <ComboboxEmpty>No se encontraron tipos.</ComboboxEmpty>
                <ComboboxList>
                  {(option: MovementTypeOption) => (
                    <ComboboxItem key={option.value} value={option} className="pr-8">
                      {option.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {hasGlobalFilter ? (
            <Button
              aria-label="Reset filters"
              variant="outline"
              size="sm"
              className="h-8 border-dashed xl:mb-0.5 xl:flex-none"
              onClick={() => table.setGlobalFilter("")}
            >
              <X />
              Limpiar
            </Button>
          ) : null}
        </div>

        <div className="flex w-full items-center justify-end gap-2 lg:ml-auto lg:w-auto lg:self-start xl:self-end">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
