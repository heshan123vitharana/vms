'use client';

import { useMemo, useState } from 'react';

// next
import { useRouter } from 'next/navigation';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
import { AddCircle, Eye } from '@wandersonalwes/iconsax-react';

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
import { useGetTransfers } from 'api/transfer';

// types
import { Transfer } from 'types/transfer';

// ==============================|| SELECT FILTER ||============================== //

function SelectFilter({ column, table }: { column: Column<any, unknown>; table: TanTable<any> }) {
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const sortedUniqueValues = Array.from(facetedUniqueValues.keys()).sort();
  const columnFilterValue = column.getFilterValue();

  return (
    <FormControl fullWidth size="small">
      <Select
        value={columnFilterValue || ''}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        displayEmpty
        sx={{ 
          minWidth: 120,
          fontSize: '0.875rem',
          '& .MuiSelect-select': {
            py: 0.75
          }
        }}
      >
        <MenuItem value="">All</MenuItem>
        {sortedUniqueValues.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// Status chip component
function StatusChip({ status }: { status: string }) {
  let color: 'success' | 'warning' | 'error' | 'default' = 'default';
  
  switch (status) {
    case 'completed':
      color = 'success';
      break;
    case 'pending':
      color = 'warning';
      break;
    default:
      color = 'default';
  }
  
  return <Chip label={status} color={color} size="small" variant="filled" />;
}

// ==============================|| REACT TABLE ||============================== //

interface ReactTableProps {
  columns: ColumnDef<Transfer>[];
  data: Transfer[];
}

function ReactTable({ columns, data }: ReactTableProps) {
  const router = useRouter();
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
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} transfers...`}
        />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button 
            variant="outlined" 
            color="success" 
            startIcon={<AddCircle />}
            onClick={() => router.push('/actions/transfer-car')}
          >
            New Transfer
          </Button>
          <CSVExport 
            data={table.getFilteredRowModel().rows.map((row) => row.original).map((item) => ({
              'Transfer ID': item.id,
              'Stock Number': item.vehicle?.stockNumber || '-',
              'Make': item.vehicle?.make || '-',
              'Model': item.vehicle?.model || '-',
              'Year': item.vehicle?.year || '-',
              'Color': item.vehicle?.color || '-',
              'From Dealer': item.fromDealer?.name || '-',
              'To Dealer': item.toDealer?.name || '-',
              'Transfer Date': item.transferDate,
              'Transfer Price': item.transferPrice,
              'Transport Cost': item.transportCost,
              'Total Cost': item.transferPrice + item.transportCost,
              'Status': item.status,
              'Responsible Person': item.responsiblePerson || '-'
            }))} 
            filename="transfers-table.csv" 
          />
        </Stack>
      </Stack>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'auto', minWidth: 1400 }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell 
                    key={header.id} 
                    {...header.column.columnDef.meta}
                    sx={{ 
                      width: header.column.getSize(), 
                      minWidth: header.column.getSize(),
                      textAlign: 'center',
                      fontWeight: 600,
                      bgcolor: 'grey.100'
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const useSelectFilter = [
                    'vehicle.stockNumber', 
                    'vehicle.make', 
                    'vehicle.model', 
                    'vehicle.year',
                    'vehicle.color',
                    'fromDealer.name',
                    'toDealer.name',
                    'status'
                  ].includes(header.column.id);
                  return (
                    <TableCell 
                      key={header.id} 
                      {...header.column.columnDef.meta}
                      sx={{ 
                        width: header.column.getSize(), 
                        minWidth: header.column.getSize(),
                        maxWidth: header.column.getSize(),
                        padding: '8px',
                        overflow: 'visible',
                        verticalAlign: 'top'
                      }}
                    >
                      {header.column.getCanFilter() && useSelectFilter ? (
                        <SelectFilter column={header.column} table={table} />
                      ) : (
                        header.column.getCanFilter() && <Filter column={header.column} table={table} />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      {...cell.column.columnDef.meta}
                      sx={{ 
                        width: cell.column.getSize(), 
                        minWidth: cell.column.getSize(),
                        py: 1.5,
                        px: 2
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow sx={{ '&.MuiTableRow-root:hover': { bgcolor: 'transparent' } }}>
                <TableCell colSpan={table.getAllColumns().length}>
                  <EmptyTable msg="No Transfer Records Found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

// ==============================|| TRANSFERS TABLE PAGE ||============================== //

export default function TransfersPage() {
  const router = useRouter();
  const { transfers, transfersLoading, transfersError } = useGetTransfers();

  const columns = useMemo<ColumnDef<Transfer>[]>(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
        size: 80,
        meta: { className: 'cell-center' }
      },
      {
        header: 'Stock Number',
        accessorKey: 'vehicle.stockNumber',
        size: 140,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Make',
        accessorKey: 'vehicle.make',
        size: 120,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Model',
        accessorKey: 'vehicle.model',
        size: 150,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Year',
        accessorKey: 'vehicle.year',
        size: 80,
        meta: { className: 'cell-center' },
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Color',
        accessorKey: 'vehicle.color',
        size: 100,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'From Dealer',
        accessorKey: 'fromDealer.name',
        size: 160,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'To Dealer',
        accessorKey: 'toDealer.name',
        size: 160,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Transfer Date',
        accessorKey: 'transferDate',
        size: 130,
        cell: ({ getValue }) => {
          const date = getValue() as string;
          return date ? new Date(date).toLocaleDateString() : '-';
        }
      },
      {
        header: 'Transfer Price',
        accessorKey: 'transferPrice',
        size: 140,
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return value ? `LKR ${value.toLocaleString()}` : '-';
        },
        meta: { className: 'cell-right' }
      },
      {
        header: 'Transport Cost',
        accessorKey: 'transportCost',
        size: 140,
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return value ? `LKR ${value.toLocaleString()}` : '-';
        },
        meta: { className: 'cell-right' }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        size: 120,
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return <StatusChip status={status} />;
        }
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
            onClick={() => router.push(`/vehicle-details/${row.original.vehicleId}`)}
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
  if (transfersLoading) {
    return (
      <MainCard content={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (transfersError) {
    return (
      <MainCard content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Failed to load transfers. Please try again later.
          </Alert>
        </Box>
      </MainCard>
    );
  }

  return <ReactTable columns={columns} data={transfers} />;
}
