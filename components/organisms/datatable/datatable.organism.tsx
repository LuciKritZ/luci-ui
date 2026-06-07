'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { LayoutGridIcon, ListIcon, SearchIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/atoms/index.atoms';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/index.atoms';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/atoms/input-group.atom';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  renderGridCard?: (data: TData) => React.ReactNode;
  searchKey: string;
  searchPlaceholder?: string;
  viewMode?: 'grid' | 'list';
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  onViewModeChange,
  renderGridCard,
  searchKey,
  searchPlaceholder = 'Search...',
  viewMode = 'list',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [localViewMode, setLocalViewMode] = React.useState<'grid' | 'list'>(
    viewMode
  );

  React.useEffect(() => {
    setLocalViewMode(viewMode);
  }, [viewMode]);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setLocalViewMode(mode);
    if (onViewModeChange) onViewModeChange(mode);
  };

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
    },
  });

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 flex-1'>
          <InputGroup className='w-full max-w-sm border-(--preview-border) bg-(--preview-input)'>
            <InputGroupAddon>
              <SearchIcon className='h-4 w-4 text-muted-foreground' />
            </InputGroupAddon>
            <InputGroupInput
              className='text-xs placeholder:text-muted-foreground text-(--preview-content)'
              onChange={event =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
              }
            />
          </InputGroup>
        </div>
        <div className='flex items-center gap-2'>
          {renderGridCard && (
            <div className='flex items-center border border-border rounded-md p-0.5 bg-muted/50'>
              <Button
                className={`h-7 w-7 rounded-sm \${localViewMode === "list" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
                onClick={() => handleViewModeChange('list')}
                size='icon'
                variant='ghost'
              >
                <ListIcon className='h-4 w-4' />
              </Button>
              <Button
                className={`h-7 w-7 rounded-sm \${localViewMode === "grid" ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
                onClick={() => handleViewModeChange('grid')}
                size='icon'
                variant='ghost'
              >
                <LayoutGridIcon className='h-4 w-4' />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className='relative rounded-md border border-border bg-card'>
        {loading && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-md'>
            <div className='flex flex-col items-center gap-2 text-muted-foreground'>
              <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary'></div>
              <p className='text-sm'>Loading data...</p>
            </div>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='rounded-full bg-muted p-3 mb-4'>
              <SearchIcon className='h-6 w-6 text-muted-foreground' />
            </div>
            <h3 className='text-lg font-medium'>No results found</h3>
            <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
              We couldn&apos;t find any data matching your current filters. Try
              adjusting your search.
            </p>
          </div>
        )}

        {localViewMode === 'list' || !renderGridCard ? (
          <div className='w-full overflow-auto'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length
                  ? table.getRowModel().rows.map(row => (
                      <TableRow
                        data-state={row.getIsSelected() && 'selected'}
                        key={row.id}
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : !loading && (
                      <TableRow>
                        <TableCell
                          className='h-24 text-center'
                          colSpan={columns.length}
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
            {table.getRowModel().rows.map(row => (
              <div key={row.id}>{renderGridCard(row.original)}</div>
            ))}
          </div>
        )}
      </div>

      <div className='flex items-center justify-between space-x-2 py-2'>
        <div className='text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size='sm'
            variant='outline'
          >
            Previous
          </Button>
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size='sm'
            variant='outline'
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
