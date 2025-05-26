import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useQueryColaboradores } from "@/hooks/colaboradores/useQueryColaboradores";
import { Result } from "@/interfaces/colaboradores.interfaces";

interface DataTableProps {
  columns: ColumnDef<Result>[];
}

export function DataTable({ columns }: DataTableProps) {
  const [pagination, setPagination] = useState<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { data } = useQueryColaboradores(pagination, globalFilter);

  const table = useReactTable({
    data: data?.results || [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    rowCount: data?.total || 0,
    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      pagination,
      globalFilter,
    },
  });

  return (
    <>
      <header className="flex items-center justify-between">
        <Input startContent={<Search />} placeholder="Buscar Colaborador" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
        <Button variant="custom2" size="sm" asChild>
          <Link to="/colaboradores/agregar">
            <Plus />
            Nuevo Colaborador
          </Link>
        </Button>
      </header>
      <div className="rounded-3xl border">
        <Table>
          <TableCaption>Tabla de colaboradores</TableCaption>
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
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {data?.results.length === 0 ? (
                    <span className="text-sm text-gray-500">No hay resultados</span>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" />
                      <span className="text-sm text-gray-500">Cargando...</span>
                    </div>
                  )}
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
              {[5, 10, 15].map((pageSize) => (
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
    </>
  );
}
