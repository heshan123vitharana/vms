'use client';

import { useMemo, useState } from 'react';

// next
import { useRouter } from 'next/navigation';

// material-ui
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

// assets
import { Eye } from '@wandersonalwes/iconsax-react';

// third-party
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  flexRender,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  HeaderGroup,
  Column,
  Table as TanTable
} from '@tanstack/react-table';

// project-imports
import MainCard from 'components/MainCard';
import { CSVExport, DebouncedInput, EmptyTable, Filter } from 'components/third-party/react-table';
import { useGetSales } from 'api/sales';

// types
import { Sale } from 'types/sales';

// ==============================|| DROPDOWN SELECT FILTER ||============================== //

// Columns that use a dropdown select filter (populated dynamically from row data)
const SELECT_FILTER_COLS = new Set(['make', 'model', 'color', 'paymentMethod']);

function SelectFilter({ column, table }: { column: Column<any, unknown>; table: TanTable<any> }) {
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const sortedUniqueValues = Array.from(facetedUniqueValues.keys())
    .filter((v) => v !== null && v !== undefined && v !== '')
    .sort();
  const columnFilterValue = column.getFilterValue();

  return (
    <FormControl fullWidth size="small">
      <Select
        value={(columnFilterValue as string) ?? ''}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        displayEmpty
        sx={{
          minWidth: 120,
          fontSize: '0.875rem',
          '& .MuiSelect-select': { py: 0.75 }
        }}
      >
        <MenuItem value="">All</MenuItem>
        {sortedUniqueValues.map((value) => (
          <MenuItem key={String(value)} value={value}>
            {String(value)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// ==============================|| REACT TABLE ||============================== //

interface ReactTableProps {
  columns: ColumnDef<Sale>[];
  data: Sale[];
}

function ReactTable({ columns, data }: ReactTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter
  });

  return (
    <MainCard content={false}>
      {/* Toolbar */}
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} sales...`}
        />
        <CSVExport
          data={table.getFilteredRowModel().rows.map((row) => row.original).map((item) => ({
            'Sale ID': item.id,
            'Stock Number': item.vehicle?.stockNumber || '-',
            'Make': item.vehicle?.make || '-',
            'Model': item.vehicle?.model || '-',
            'Year': item.vehicle?.year || '-',
            'Color': item.vehicle?.color || '-',
            'Seller Name': item.seller?.name || '-',
            'Seller Phone': item.seller?.phone || '-',
            'Sale Date': item.saleDate,
            'Sale Price': item.salePrice,
            'Discount': item.discount,
            'Final Amount': item.finalAmount,
            'Payment Method': item.paymentMethod?.name || '-',
            'Invoice Number': item.invoiceNumber,
            'Salesperson': item.salespersonName,
            'Commission': item.commission
          }))}
          filename="sales-table.csv"
        />
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'fixed', minWidth: 1900 }}>

          {/* Column width definitions */}
          <colgroup>
            {table.getAllColumns().map((col) => (
              <col key={col.id} style={{ width: col.getSize(), minWidth: col.getSize() }} />
            ))}
          </colgroup>

          <TableHead>
            {/* Row 1: Column headers */}
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
              <TableRow key={`title-${headerGroup.id}`}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 600,
                      bgcolor: 'grey.100',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      px: 1.5,
                      py: 1
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {/* Row 2: Filter inputs */}
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
              <TableRow key={`filter-${headerGroup.id}`}>
                {headerGroup.headers.map((header) => {
                  const useSelectFilter = SELECT_FILTER_COLS.has(header.column.id);
                  return (
                    <TableCell
                      key={header.id}
                      sx={{ px: 1, py: 0.75, verticalAlign: 'top', bgcolor: 'grey.50' }}
                    >
                      {header.column.getCanFilter() ? (
                        useSelectFilter ? (
                          <SelectFilter column={header.column} table={table} />
                        ) : (
                          <Filter column={header.column} table={table} />
                        )
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          {/* Body */}
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{ py: 1.25, px: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow sx={{ '&.MuiTableRow-root:hover': { bgcolor: 'transparent' } }}>
                <TableCell colSpan={table.getAllColumns().length}>
                  <EmptyTable msg="No Sales Records Found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </MainCard>
  );
}

// ==============================|| SALES TABLE PAGE ||============================== //

export default function SalesPage() {
  const router = useRouter();
  const { sales, salesLoading, salesError } = useGetSales();

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        size: 70,
        meta: { className: 'cell-center' },
        enableColumnFilter: false
      },
      {
        header: 'Stock Number',
        id: 'stockNumber',
        accessorFn: (row) => row.vehicle?.stockNumber ?? '',
        size: 160,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Make',
        id: 'make',
        accessorFn: (row) => row.vehicle?.make ?? '',
        size: 150,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Model',
        id: 'model',
        accessorFn: (row) => row.vehicle?.model ?? '',
        size: 180,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Year',
        id: 'year',
        accessorFn: (row) => row.vehicle?.year ?? '',
        size: 80,
        meta: { className: 'cell-center' },
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Color',
        id: 'color',
        accessorFn: (row) => row.vehicle?.color ?? '',
        size: 140,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Seller Name',
        id: 'sellerName',
        accessorFn: (row) => row.seller?.name ?? '',
        size: 190,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Seller Phone',
        id: 'sellerPhone',
        accessorFn: (row) => row.seller?.phone ?? '',
        size: 150,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Sale Date',
        accessorKey: 'saleDate',
        size: 130,
        cell: ({ getValue }) => {
          const date = getValue() as string;
          return date ? new Date(date).toLocaleDateString() : '-';
        }
      },
      {
        header: 'Sale Price',
        accessorKey: 'salePrice',
        size: 160,
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return value ? `LKR ${value.toLocaleString()}` : '-';
        },
        meta: { className: 'cell-right' }
      },
      {
        header: 'Payment Method',
        id: 'paymentMethod',
        accessorFn: (row) => row.paymentMethod?.name ?? '',
        size: 170,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Invoice',
        accessorKey: 'invoiceNumber',
        size: 180,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'View Vehicle',
        id: 'viewVehicle',
        size: 140,
        cell: ({ row }) => (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Eye size={16} />}
            onClick={() => router.push(`/tables/vehicles/${row.original.vehicleId}`)}
          >
            View
          </Button>
        ),
        meta: { className: 'cell-center' },
        enableColumnFilter: false
      }
    ],
    [router]
  );

  // Loading state
  if (salesLoading) {
    return (
      <MainCard content={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (salesError) {
    return (
      <MainCard content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Failed to load sales. Please try again later.
          </Alert>
        </Box>
      </MainCard>
    );
  }

  return <ReactTable columns={columns} data={sales} />;
}
