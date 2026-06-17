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
  onRowClick?: (row: TData) => void;
  emptyMessage?: React.ReactNode;
  internalScrollLayout?: boolean;
  toolbarClassName?: string;
  tableWrapperClassName?: string;
  scrollContainerClassName?: string;
  footerClassName?: string;
}

export function DataTable<TData extends { id: string | number }>({
  table,
  actionBar,
  children,
  isLoading,
  clickRow = false,
  onRowClick,
  emptyMessage = "No hay datos.",
  internalScrollLayout = false,
  className,
  toolbarClassName,
  tableWrapperClassName,
  scrollContainerClassName,
  footerClassName,
  ...props
}: DataTableProps<TData>) {
  const navigate = useNavigate();

  const handleRowClick = (row: TData) => {
    if (onRowClick) {
      onRowClick(row);
      return;
    }

    if (clickRow) {
      navigate(`/colaboradores/editar/${row.id}`);
    }
  };

  const tableContent = (
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
                  className={cn((cell.column.columnDef.meta as { cellClassName?: string } | undefined)?.cellClassName, {
                    "cursor-pointer": clickRow || Boolean(onRowClick),
                  })}
                  style={{
                    ...getCommonPinningStyles({ column: cell.column }),
                  }}
                  onClick={() => {
                    if (clickRow || onRowClick) {
                      handleRowClick(row.original);
                    }
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
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  if (internalScrollLayout) {
    return (
      <div className={cn("flex min-w-0 flex-1 flex-col overflow-hidden", className)} {...props}>
        <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border", tableWrapperClassName)}>
          {children ? <div className={cn("shrink-0 border-b bg-background", toolbarClassName)}>{children}</div> : null}
          <div className={cn("min-h-0 flex-1 overflow-auto", scrollContainerClassName)}>{tableContent}</div>
          <div className={cn("flex shrink-0 flex-col gap-2.5 border-t bg-background", footerClassName)}>
            <DataTablePagination table={table} />
            {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex min-w-0 flex-1 flex-col gap-4 overflow-hidden", className)} {...props}>
      {children ? <div className={cn("shrink-0", toolbarClassName)}>{children}</div> : null}
      <div className={cn("relative flex min-h-[320px] min-w-0 flex-1 overflow-hidden rounded-lg border sm:min-h-[360px]", tableWrapperClassName)}>
        <div className={cn("min-w-0 flex-1 overflow-auto", scrollContainerClassName)}>{tableContent}</div>
      </div>
      <div className={cn("flex shrink-0 flex-col gap-2.5", footerClassName)}>
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
