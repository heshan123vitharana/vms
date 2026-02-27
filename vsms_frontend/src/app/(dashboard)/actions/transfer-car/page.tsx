'use client';

import { useState, useCallback } from 'react';
import { useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project-imports
import MainCard from 'components/MainCard';
import { useGetDealers, searchVehiclesForTransfer, createTransfer } from 'api/transfer';
import { openSnackbar } from 'api/snackbar';
import { VehicleSearchResult, TransferFormData } from 'types/transfer';

// assets
import { ArrowLeft, Car } from '@wandersonalwes/iconsax-react';

// next
import { useRouter } from 'next/navigation';

// validation schema
const validationSchema = yup.object({
  vehicle_id: yup.number().required('Vehicle is required'),
  from_dealer_id: yup.number().nullable(),
  to_dealer_id: yup.number().required('Destination dealer is required'),
  transfer_date: yup.string().required('Transfer date is required'),
  transfer_price: yup.number().min(0, 'Transfer price must be positive'),
  transport_cost: yup.number().min(0, 'Transport cost must be positive'),
  status: yup.string().required('Transfer status is required'),
  responsible_person: yup.string().required('Responsible person is required').max(255)
});

export default function TransferCarPage() {
  const router = useRouter();
  const { dealers, dealersLoading } = useGetDealers();
  
  const [vehicleSearchResults, setVehicleSearchResults] = useState<VehicleSearchResult[]>([]);
  const [vehicleSearchLoading, setVehicleSearchLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSearchResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      vehicle_id: 0,
      from_dealer_id: '' as number | string,
      to_dealer_id: 0,
      transfer_date: '',
      transfer_price: 0,
      transport_cost: 0,
      status: 'pending',
      responsible_person: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        const transferData: TransferFormData = {
          vehicle_id: values.vehicle_id,
          from_dealer_id: values.from_dealer_id ? Number(values.from_dealer_id) : null,
          to_dealer_id: values.to_dealer_id,
          transfer_date: values.transfer_date,
          transfer_price: values.transfer_price,
          transport_cost: values.transport_cost,
          status: values.status as 'pending' | 'completed',
          responsible_person: values.responsible_person
        };

        const result = await createTransfer(transferData);
        
        if (result.success) {
          openSnackbar({
            open: true,
            message: 'Car transfer created successfully!',
            variant: 'alert',
            alert: {
              color: 'success',
              variant: 'filled'
            },
            close: true
          } as any);
          
          setTimeout(() => {
            formik.resetForm();
            setSelectedVehicle(null);
            setVehicleSearchResults([]);
          }, 1000);
        } else {
          openSnackbar({
            open: true,
            message: result.error || 'Failed to create car transfer',
            variant: 'alert',
            alert: {
              color: 'error',
              variant: 'filled'
            },
            close: true
          } as any);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        openSnackbar({
          open: true,
          message: 'An unexpected error occurred',
          variant: 'alert',
          alert: {
            color: 'error',
            variant: 'filled'
          },
          close: true
        } as any);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Resolve the current branch/dealer name for the selected vehicle.
  // The search result includes dealer_name from a left-join; if it's absent
  // (vehicle has no dealer_id or the join returned null), fall back to the
  // loaded dealers list.
  const resolveFromBranchName = (vehicle: VehicleSearchResult | null): string => {
    if (!vehicle) return 'Select a vehicle first';
    if (vehicle.dealer_name) return vehicle.dealer_name;
    if (vehicle.dealer_id) {
      const found = dealers.find((d) => Number(d.id) === Number(vehicle.dealer_id));
      if (found) return found.name;
    }
    return 'No branch assigned';
  };

  const handleVehicleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setVehicleSearchResults([]);
      return;
    }
    
    setVehicleSearchLoading(true);
    try {
      const results = await searchVehiclesForTransfer(query);
      setVehicleSearchResults(results);
    } catch (error) {
      console.error('Error searching vehicles:', error);
      setVehicleSearchResults([]);
    } finally {
      setVehicleSearchLoading(false);
    }
  }, []);

  // Set transfer date on client mount to avoid server/client hydration mismatches
  useEffect(() => {
    if (!formik.values.transfer_date) {
      const today = new Date().toISOString().split('T')[0];
      formik.setFieldValue('transfer_date', today);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync from_dealer_id for form submission whenever selectedVehicle changes.
  useEffect(() => {
    if (!selectedVehicle) {
      formik.setFieldValue('from_dealer_id', '');
      return;
    }
    const dealerId = selectedVehicle.dealer_id != null && Number(selectedVehicle.dealer_id) > 0
      ? Number(selectedVehicle.dealer_id)
      : null;
    formik.setFieldValue('from_dealer_id', dealerId ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicle]);

  const handleVehicleChange = (_event: unknown, value: VehicleSearchResult | null) => {
    setSelectedVehicle(value);
    if (value) {
      formik.setFieldValue('vehicle_id', value.id);
      formik.setFieldValue('transfer_price', value.price ?? 0);
    } else {
      formik.setFieldValue('vehicle_id', 0);
      formik.setFieldValue('from_dealer_id', '');
      formik.setFieldValue('transfer_price', 0);
    }
  };

  return (
    <MainCard>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="text" color="secondary" startIcon={<ArrowLeft />} onClick={() => router.back()}>
            Back
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Car size={32} />
          <Typography variant="h4">Transfer A Car</Typography>
        </Stack>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                01. Transfer Details
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Vehicle *</InputLabel>
                <Autocomplete
                  options={vehicleSearchResults}
                  loading={vehicleSearchLoading}
                  getOptionLabel={(option) => `${option.stock_number} - ${option.make} ${option.model} (${option.year})`}
                  value={selectedVehicle}
                  onChange={handleVehicleChange}
                  onInputChange={(_, value, reason) => {
                    if (reason === 'input') {
                      handleVehicleSearch(value);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search by stock number, make, or model..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {vehicleSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.id}>
                      <Stack>
                        <Typography variant="body1" fontWeight={500}>
                          {option.stock_number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.make} {option.model} ({option.year}) - {option.status}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                />
                {formik.touched.vehicle_id && formik.errors.vehicle_id && (
                  <FormHelperText error>{formik.errors.vehicle_id}</FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Transfer Date *</InputLabel>
                <TextField
                  name="transfer_date"
                  type="date"
                  value={formik.values.transfer_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.transfer_date && Boolean(formik.errors.transfer_date)}
                  helperText={formik.touched.transfer_date && formik.errors.transfer_date}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>From Entity (Current Branch)</InputLabel>
                <TextField
                  value={resolveFromBranchName(selectedVehicle)}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>To Entity (Destination) *</InputLabel>
                <FormControl fullWidth error={formik.touched.to_dealer_id && Boolean(formik.errors.to_dealer_id)}>
                  <Select
                    name="to_dealer_id"
                    value={formik.values.to_dealer_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={dealersLoading}
                  >
                    <MenuItem value={0}>Select destination dealer</MenuItem>
                    {dealersLoading ? (
                      <MenuItem value={0}>Loading dealers...</MenuItem>
                    ) : dealers.length === 0 ? (
                      <MenuItem value={0}>No dealers available</MenuItem>
                    ) : (
                      dealers
                        .filter((dealer) => dealer.status !== 'inactive')
                        .map((dealer) => (
                          <MenuItem key={dealer.id} value={dealer.id}>
                            {dealer.name}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                  {formik.touched.to_dealer_id && formik.errors.to_dealer_id && (
                    <FormHelperText>{formik.errors.to_dealer_id}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Transfer Price</InputLabel>
                <TextField
                  name="transfer_price"
                  type="number"
                  value={formik.values.transfer_price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.transfer_price && Boolean(formik.errors.transfer_price)}
                  helperText={formik.touched.transfer_price && formik.errors.transfer_price}
                  fullWidth
                  placeholder="Enter transfer price"
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Transport Cost</InputLabel>
                <TextField
                  name="transport_cost"
                  type="number"
                  value={formik.values.transport_cost}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.transport_cost && Boolean(formik.errors.transport_cost)}
                  helperText={formik.touched.transport_cost && formik.errors.transport_cost}
                  fullWidth
                  placeholder="Enter transport cost"
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Responsible Person *</InputLabel>
                <TextField
                  name="responsible_person"
                  value={formik.values.responsible_person}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.responsible_person && Boolean(formik.errors.responsible_person)}
                  helperText={formik.touched.responsible_person && formik.errors.responsible_person}
                  fullWidth
                  placeholder="Enter responsible person name"
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Transfer Status *</InputLabel>
                <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                  {formik.touched.status && formik.errors.status && (
                    <FormHelperText>{formik.errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid size={12}>
              <Stack direction="row" sx={{ gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="secondary" onClick={() => {
                  formik.resetForm();
                  setSelectedVehicle(null);
                  setVehicleSearchResults([]);
                }}>
                  Reset
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isSubmitting ? 'Submitting...' : 'Create Transfer'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </MainCard>
  );
}
