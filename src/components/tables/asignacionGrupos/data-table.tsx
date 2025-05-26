import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { ModalAgregarGrupo } from "@/components/modal/grupos/modal-agregar-grupo";
import { useQueryGrupos } from "@/hooks/grupos/useQueryGrupos";
import { GruposTypeModel } from "@/interfaces/grupos.interfaces";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  setSelectedRows?: (selected: TData[]) => void;
  enableMultiRowSelection?: boolean;
  groupIds?: number[];
}

export function DataTable<TData, TValue>({ columns, setSelectedRows, enableMultiRowSelection = false, groupIds }: DataTableProps<TData, TValue>) {
  const { queryGrupos } = useQueryGrupos();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data: queryGrupos.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: queryGrupos.data?.length || 0,
    onPaginationChange: setPagination,
    getRowId: (row) => (row as GruposTypeModel).id.toString(),
    enableRowSelection: true,
    enableMultiRowSelection: enableMultiRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      pagination,
      globalFilter,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;

  useEffect(() => {
    if (!groupIds) return;

    const newSelection: Record<string, boolean> = {};
    groupIds.forEach((id) => {
      newSelection[id.toString()] = true;
    });
    table.setRowSelection(newSelection);
  }, [groupIds, table]);

  /** Actualiza al padre los grupos seleccionados */
  useEffect(() => {
    setSelectedRows?.(selectedRows.map((r) => r.original));
  }, [selectedRows, setSelectedRows, table]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <TypographyH3 text="Asignación de grupos" className="text-custom-gray" />
          <TypographyMuted text="Listado de grupos disponibles" />
        </div>
        <ModalAgregarGrupo />
      </header>
      <div className="flex-1 rounded-3xl border">
        <Table>
          <TableCaption>Tabla de asignación de grupos</TableCaption>
          <TableHeader className="from-custom-gray to-custom-green bg-gradient-to-r from-40%">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white first:rounded-tl-3xl last:rounded-tr-3xl">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => row.toggleSelected(!row.getIsSelected())}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : queryGrupos.isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    <TypographyMuted text="Cargando..." />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <footer className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">
            {pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
        </div>
        <div className="flex gap-2">
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            defaultValue={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize} filas por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={!table.getCanPreviousPage() ? "outline" : "custom2"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            size="sm"
          >
            <ChevronLeft />
            Anterior
          </Button>
          <Button
            variant={!table.getCanNextPage() ? "outline" : "custom2"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            size="sm"
          >
            Siguiente
            <ChevronRight />
          </Button>
        </div>
      </footer>
    </div>
  );
}
