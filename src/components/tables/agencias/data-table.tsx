import { ColumnDef, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TypographyH3, TypographySmall } from "@/components/ui/typography";
import { CardAgencias } from "@/components/ui/cardAgencias";
import { Input } from "@/components/ui/input";
import { ModalAgregarAgencia } from "@/components/modal/modal-agregar-agencia";
import { useQueryAgencias } from "@/hooks/agencias/useQueryAgencias";
import { AgenciasModelTypes } from "@/interfaces/agencias.interfaces";

interface DataTableProps {
  columns: ColumnDef<AgenciasModelTypes>[];
}

export function DataTableAgencias({ columns }: DataTableProps) {
  const [pagination, setPagination] = useState<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const { queryAgencias } = useQueryAgencias();

  const table = useReactTable({
    data: queryAgencias.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: queryAgencias.data?.length || 0,
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
      <header className="flex flex-col gap-3">
        <TypographyH3 text="Agencias" className="text-custom-gray" />
        <div className="flex items-center justify-between gap-3">
          <Input
            placeholder="Buscar agencia"
            startContent={<Search />}
            className="max-w-2xs"
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          />
          <ModalAgregarAgencia />
        </div>
      </header>
      <div className="grid-cols-auto-fill grid grid-flow-dense auto-rows-auto gap-6">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => <CardAgencias key={row.id} items={row.original} />)
        ) : (
          <div className="col-span-4 row-span-12">
            {queryAgencias.isPending ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin" />
                <span className="ml-2">Cargando...</span>
              </div>
            ) : (
              <TypographySmall text="No se encontraron resultados..." className="text-custom flex h-full items-center justify-center" />
            )}
          </div>
        )}
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
                  {pageSize} agencias por página
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
