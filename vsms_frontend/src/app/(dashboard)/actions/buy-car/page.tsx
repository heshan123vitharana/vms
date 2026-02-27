'use client';

import { useState, useEffect, useCallback } from 'react';

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
import { useSearchParams } from 'next/navigation';

// project-imports
import MainCard from 'components/MainCard';
import { useGetBranches, useGetPaymentMethods, searchVehicles, getVehicleDetails, createCarPurchase } from 'api/carPurchase';
import { openSnackbar } from 'api/snackbar';
import { VehicleSearchResult } from 'types/carPurchase';

// assets
import { ArrowLeft, ShoppingCart } from '@wandersonalwes/iconsax-react';

// next
import { useRouter } from 'next/navigation';

// validation schema
const validationSchema = yup.object({
  // General Details
  vehicle_id: yup.number().required('Vehicle is required'),
  purchase_date: yup.string().required('Purchase date is required'),
  branch: yup.string().required('Branch is required'),
  purchase_price: yup.number().required('Purchase price is required').min(0, 'Price must be positive'),
  payment_method_id: yup.number().required('Payment method is required'),
  invoice_number: yup.string().required('Invoice number is required').max(100),
  tax_details: yup.string().nullable(),
  
  // Seller Details
  seller_name: yup.string().required('Seller name is required').max(150),
  seller_address: yup.string().required('Seller address is required').max(255),
  seller_phone: yup.string().required('Contact number is required').max(20),
  seller_email: yup.string().email('Invalid email').nullable().max(150)
});

export default function BuyCarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleIdParam = searchParams.get('vehicleId');
  
  const { branches, branchesLoading } = useGetBranches();
  const { paymentMethods, paymentMethodsLoading } = useGetPaymentMethods();
  
  const [vehicleSearchResults, setVehicleSearchResults] = useState<VehicleSearchResult[]>([]);
  const [vehicleSearchLoading, setVehicleSearchLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSearchResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pre-fill vehicle from URL parameter
  useEffect(() => {
    if (vehicleIdParam) {
      const vehicleId = parseInt(vehicleIdParam, 10);
      if (!isNaN(vehicleId)) {
        getVehicleDetails(vehicleId).then((result) => {
          if (result.success && result.data) {
            const vehicle = result.data;
            setSelectedVehicle({
              id: vehicle.id,
              stock_number: vehicle.stockNumber,
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              price: vehicle.price,
              status: vehicle.status
            });
            formik.setFieldValue('vehicle_id', vehicle.id);
            formik.setFieldValue('purchase_price', vehicle.price || 0);
          }
        });
      }
    }
  }, [vehicleIdParam]);

  const handleVehicleSearch = useCallback(async (query: string) => {
    if (query.length < 1) {
      setVehicleSearchResults([]);
      return;
    }
    
    setVehicleSearchLoading(true);
    try {
      const results = await searchVehicles(query);
      setVehicleSearchResults(results);
    } catch (error) {
      console.error('Error searching vehicles:', error);
      setVehicleSearchResults([]);
    } finally {
      setVehicleSearchLoading(false);
    }
  }, []);

  const handleVehicleChange = async (_: any, value: VehicleSearchResult | null) => {
    setSelectedVehicle(value);
    if (value) {
      formik.setFieldValue('vehicle_id', value.id);
      formik.setFieldValue('purchase_price', value.price || 0);
    } else {
      formik.setFieldValue('vehicle_id', 0);
    }
  };

  const formik = useFormik({
    initialValues: {
      vehicle_id: 0,
      purchase_date: new Date().toISOString().split('T')[0],
      branch: '',
      purchase_price: 0,
      payment_method_id: 0,
      invoice_number: '',
      tax_details: '',
      document: null,
      seller_name: '',
      seller_address: '',
      seller_phone: '',
      seller_email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        const purchaseData = {
          vehicle_id: values.vehicle_id,
          purchase_date: values.purchase_date,
          branch: values.branch,
          purchase_price: values.purchase_price,
          payment_method_id: values.payment_method_id,
          invoice_number: values.invoice_number,
          tax_details: values.tax_details || '',
          document: values.document,
          seller_name: values.seller_name,
          seller_address: values.seller_address,
          seller_phone: values.seller_phone,
          seller_email: values.seller_email || undefined
        };

        const result = await createCarPurchase(purchaseData as any);
        
        if (result.success) {
          openSnackbar({
            open: true,
            message: 'Car purchase created successfully!',
            variant: 'alert',
            alert: {
              color: 'success',
              variant: 'filled'
            },
            close: true
          } as any);
          
          // Redirect to purchases list after a short delay
          setTimeout(() => {
            router.push('/actions/buy-car');
          }, 1000);
        } else {
          openSnackbar({
            open: true,
            message: result.error || 'Failed to create car purchase',
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

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue('document', file);
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
          <ShoppingCart size={32} />
          <Typography variant="h4">Buy A Car</Typography>
        </Stack>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* 01. General Details Section */}
            <Grid size={12}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                01. General Details
              </Typography>
              <Divider />
            </Grid>

            {/* Vehicle Code - Autocomplete */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Stock Number *</InputLabel>
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

            {/* Date/Time */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Date/Time *</InputLabel>
                <TextField
                  name="purchase_date"
                  type="date"
                  value={formik.values.purchase_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.purchase_date && Boolean(formik.errors.purchase_date)}
                  helperText={formik.touched.purchase_date && formik.errors.purchase_date}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Grid>

            {/* Branch (Dropdown) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Branch *</InputLabel>
                <FormControl fullWidth error={formik.touched.branch && Boolean(formik.errors.branch)}>
                  <Select
                    name="branch"
                    value={formik.values.branch}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={branchesLoading}
                  >
                    {branchesLoading ? (
                      <MenuItem value="">Loading branches...</MenuItem>
                    ) : branches.length === 0 ? (
                      <MenuItem value="">No branches available</MenuItem>
                    ) : (
                      branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {formik.touched.branch && formik.errors.branch && (
                    <FormHelperText>{formik.errors.branch}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>

            {/* Purchase Price */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Purchase Price *</InputLabel>
                <TextField
                  name="purchase_price"
                  type="number"
                  value={formik.values.purchase_price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.purchase_price && Boolean(formik.errors.purchase_price)}
                  helperText={formik.touched.purchase_price && formik.errors.purchase_price}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* Payment Method (Dropdown) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Payment Method *</InputLabel>
                <FormControl fullWidth error={formik.touched.payment_method_id && Boolean(formik.errors.payment_method_id)}>
                  <Select
                    name="payment_method_id"
                    value={formik.values.payment_method_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={paymentMethodsLoading}
                  >
                    {paymentMethodsLoading ? (
                      <MenuItem value={0}>Loading payment methods...</MenuItem>
                    ) : paymentMethods.length === 0 ? (
                      <MenuItem value={0}>No payment methods available</MenuItem>
                    ) : (
                      paymentMethods.map((method) => (
                        <MenuItem key={method.id} value={method.id}>
                          {method.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {formik.touched.payment_method_id && formik.errors.payment_method_id && (
                    <FormHelperText>{formik.errors.payment_method_id}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>

            {/* Invoice Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Invoice Number *</InputLabel>
                <TextField
                  name="invoice_number"
                  value={formik.values.invoice_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.invoice_number && Boolean(formik.errors.invoice_number)}
                  helperText={formik.touched.invoice_number && formik.errors.invoice_number}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* Tax Details (Long Text Field) */}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Tax Details</InputLabel>
                <TextField
                  name="tax_details"
                  value={formik.values.tax_details}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tax_details && Boolean(formik.errors.tax_details)}
                  helperText={formik.touched.tax_details && formik.errors.tax_details}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter tax details or notes..."
                />
              </Stack>
            </Grid>

            {/* Document Upload */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Document Upload</InputLabel>
                <Button
                  variant="outlined"
                  component="label"
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleDocumentChange}
                  />
                </Button>
                {formik.values.document && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {(formik.values.document as File)?.name}
                  </Typography>
                )}
              </Stack>
            </Grid>

            {/* 02. Seller Details Section */}
            <Grid size={12}>
              <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
                02. Seller Details
              </Typography>
              <Divider />
            </Grid>

            {/* Seller Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Seller Name *</InputLabel>
                <TextField
                  name="seller_name"
                  value={formik.values.seller_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.seller_name && Boolean(formik.errors.seller_name)}
                  helperText={formik.touched.seller_name && formik.errors.seller_name}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Address *</InputLabel>
                <TextField
                  name="seller_address"
                  value={formik.values.seller_address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.seller_address && Boolean(formik.errors.seller_address)}
                  helperText={formik.touched.seller_address && formik.errors.seller_address}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* Contact Number (Mandatory) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Contact Number *</InputLabel>
                <TextField
                  name="seller_phone"
                  value={formik.values.seller_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.seller_phone && Boolean(formik.errors.seller_phone)}
                  helperText={formik.touched.seller_phone && formik.errors.seller_phone}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* Email (Not Mandatory) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Email (Optional)</InputLabel>
                <TextField
                  name="seller_email"
                  type="email"
                  value={formik.values.seller_email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.seller_email && Boolean(formik.errors.seller_email)}
                  helperText={formik.touched.seller_email && formik.errors.seller_email}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* Form Actions */}
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
                  {isSubmitting ? 'Submitting...' : 'Submit Purchase'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </MainCard>
  );
}
