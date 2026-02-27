'use client';

import { useMemo, useState, useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';

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
import { AddCircle, Eye, ShoppingCart } from '@wandersonalwes/iconsax-react';

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
import { useGetVehicles } from 'api/vehicle';

// types
import { Vehicle, VehicleStatus } from 'types/vehicle';

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

// ==============================|| STATUS CHIP ||============================== //

function StatusChip({ status }: { status: VehicleStatus }) {
  let color: 'success' | 'warning' | 'error' | 'info' = 'info';
  
  switch (status) {
    case 'Available':
      color = 'success';
      break;
    case 'Reserved':
      color = 'info';
      break;
    case 'Sold':
      color = 'warning';
      break;
    case 'Transferred':
      color = 'error';
      break;
  }
  
  return <Chip label={status} color={color} size="small" variant="filled" />;
}

interface ReactTableProps {
  columns: ColumnDef<Vehicle>[];
  data: Vehicle[];
}

// ==============================|| REACT TABLE ||============================== //

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
          placeholder={`Search ${data.length} vehicles...`}
        />
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button 
            variant="outlined" 
            color="success" 
            startIcon={<AddCircle />}
            onClick={() => router.push('/tables/vehicles/vehicleRegisterForm')}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add New Vehicle
          </Button>
          <CSVExport data={table.getFilteredRowModel().rows.map((row) => row.original)} filename="vehicles-table.csv" />
        </Stack>
      </Stack>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'auto', minWidth: 2750 }}>
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
                  const useSelectFilter = ['make', 'model', 'color', 'dealer', 'vehicleType', 'fuelType', 'transmissionType', 'countryOfOrigin', 'status'].includes(header.column.id);
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
                  <EmptyTable msg="No Vehicles Found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

// ==============================|| VEHICLES TABLE PAGE ||============================== //

export default function VehiclesPage() {
  const router = useRouter();
  const { vehicles, vehiclesLoading, vehiclesError } = useGetVehicles(true);

  useEffect(() => {
    mutate('vehicles?status=all'); // Refresh vehicle data when page is opened
  }, []);

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        header: 'Stock Number',
        accessorKey: 'stockNumber',
        size: 150,
        meta: { className: 'cell-center' }
      },
      {
        header: 'Make',
        accessorKey: 'make',
        size: 150
      },
      {
        header: 'Model',
        accessorKey: 'model',
        size: 170
      },
      {
        header: 'Sub Model',
        accessorKey: 'subModel',
        size: 150,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Vehicle Type',
        accessorKey: 'vehicleType',
        size: 150,
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return <Chip label={value} size="small" color="primary" variant="outlined" />;
        }
      },
      {
        header: 'Year',
        accessorKey: 'year',
        size: 100,
        meta: { className: 'cell-center' }
      },
      {
        header: 'Color',
        accessorKey: 'color',
        size: 130
      },
      {
        header: 'Fuel Type',
        accessorKey: 'fuelType',
        size: 160,
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return <Chip label={value} size="small" variant="outlined" />;
        }
      },
      {
        header: 'Transmission',
        accessorKey: 'transmissionType',
        size: 160,
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return <Chip label={value} size="small" variant="outlined" />;
        }
      },
      {
        header: 'Engine Size',
        accessorKey: 'engineSize',
        size: 130,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Mileage',
        accessorKey: 'mileage',
        size: 130,
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return `${value.toLocaleString()} km`;
        },
        meta: { className: 'cell-right' }
      },
      {
        header: 'Country',
        accessorKey: 'countryOfOrigin',
        size: 150
      },
      {
        header: 'VIN',
        accessorKey: 'vin',
        size: 180,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Reg. Type',
        accessorKey: 'registrationType',
        size: 140,
        cell: ({ getValue }) => {
          const type = getValue() as string;
          return <Chip label={type} size="small" color={type === 'Registered' ? 'primary' : 'default'} variant="outlined" />;
        }
      },
      {
        header: 'Price',
        accessorKey: 'price',
        size: 140,
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return `LKR ${value.toLocaleString()}`;
        },
        meta: { className: 'cell-right' }
      },
      {
        header: 'Branch',
        accessorKey: 'dealer',
        size: 200
      },
      {
        header: 'Tenant',
        accessorKey: 'tenant',
        size: 180,
        cell: ({ getValue }) => getValue() || '-'
      },
      {
        header: 'Status',
        accessorKey: 'status',
        size: 140,
        cell: ({ getValue }) => {
          const status = getValue() as VehicleStatus;
          return <StatusChip status={status} />;
        }
      },
      {
        header: 'View',
        id: 'view',
        size: 100,
        cell: ({ row }) => (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Eye size={16} />}
            onClick={() => router.push(`/tables/vehicles/${row.original.id}`)}
          >
            View
          </Button>
        ),
        meta: { className: 'cell-center' },
        enableColumnFilter: false
      },
      {
        header: 'Sell',
        id: 'sell',
        size: 140,
        cell: ({ row }) => {
          const isAvailable = row.original.status === 'Available';
          return (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<ShoppingCart size={16} />}
              disabled={!isAvailable}
              onClick={() => router.push(`/actions/sell-car?vehicleId=${row.original.id}`)}
            >
              {isAvailable ? 'Sell' : 'Sold'}
            </Button>
          );
        },
        meta: { className: 'cell-center' },
        enableColumnFilter: false
      }
    ],
    [router]
  );

  // Loading state
  if (vehiclesLoading) {
    return (
      <MainCard content={false}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (vehiclesError) {
    return (
      <MainCard content={false}>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            Failed to load vehicles. Please try again later.
          </Alert>
        </Box>
      </MainCard>
    );
  }

  return <ReactTable columns={columns} data={vehicles} />;
}
