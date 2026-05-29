import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import type * as React from "react";
import { DataTablePagination } from "@/components/ui/table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCommonPinningStyles } from "@/lib/data-table";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DataTableProps<TData extends { id: string | number }> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  clickRow?: boolean;
}

export function DataTable<TData extends { id: string | number }>({ table, actionBar, children, isLoading, clickRow = false }: DataTableProps<TData>) {
  const navigate = useNavigate();
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {children}
      <div className="relative flex min-h-[320px] min-w-0 flex-1 overflow-hidden rounded-lg border sm:min-h-[360px]">
        <div className="min-w-0 flex-1 overflow-auto">
            <Table className="min-w-max">
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={(header.column.columnDef.meta as { headerClassName?: string } | undefined)?.headerClassName}
                        style={{
                          ...getCommonPinningStyles({ column: header.column }),
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                      <div className="flex w-full items-center justify-center gap-1">
                        <Loader2 className="text-muted-foreground size-4 animate-spin" /> Cargando...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            (cell.column.columnDef.meta as { cellClassName?: string } | undefined)?.cellClassName,
                            {
                              "cursor-pointer": clickRow,
                            },
                          )}
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
                          onClick={() => {
                            if (clickRow) navigate(`/colaboradores/editar/${row.original.id}`);
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                      No hay datos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
