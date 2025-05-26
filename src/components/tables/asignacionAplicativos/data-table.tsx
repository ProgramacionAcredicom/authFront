import { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { AplicativosTypeModel } from "@/interfaces/aplicativos.interfaces";
import { Link } from "react-router-dom";

interface DataTableProps {
  columns: ColumnDef<AplicativosTypeModel>[];
  data: AplicativosTypeModel[];
}

export function DataTable({ columns, data }: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const rows: AplicativosTypeModel[] = data || [];
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: rows.length,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      pagination,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <TypographyH3 text="Aplicativos" className="text-custom-gray" />
          <TypographyMuted text="Listado de aplicativos disponibles" />
        </div>
        <Button asChild variant="custom2">
          <Link to="nuevo" state={{ modal: true }}>
            <Plus /> Agregar
          </Link>
        </Button>
      </header>
      <div className="flex-1 rounded-3xl border">
        <Table>
          <TableCaption>Listado de aplicativos disponibles</TableCaption>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
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
              {[5, 10, 15, 20].map((pageSize) => (
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
