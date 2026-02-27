'use client';

import { useState } from 'react';

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
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import { mutate } from 'swr';

// project-imports
import MainCard from 'components/MainCard';
import { createVehicle, uploadVehicleImages } from 'api/vehicle';
import { useGetDealers } from 'api/dealer';
import { openSnackbar } from 'api/snackbar';

// assets
import { ArrowLeft, Gallery, CloseCircle } from '@wandersonalwes/iconsax-react';

// next
import { useRouter } from 'next/navigation';

// Image categories
interface CategorizedImages {
  frontView: File | null;
  rearView: File | null;
  leftSideView: File | null;
  rightSideView: File | null;
  interior: File | null;
  engine: File | null;
  dashboard: File | null;
  others: File[];
}

// validation schema
const validationSchema = yup.object({
  make: yup.string().required('Make is required').max(100, 'Make must be at most 100 characters'),
  model: yup.string().required('Model is required').max(100, 'Model must be at most 100 characters'),
  subModel: yup.string().max(100, 'Sub Model must be at most 100 characters'),
  vehicleType: yup.string().required('Vehicle Type is required'),
  year: yup.number().required('Year is required').min(1900).max(new Date().getFullYear() + 1),
  color: yup.string().required('Color is required').max(50, 'Color must be at most 50 characters'),
  countryOfOrigin: yup.string().required('Country of Origin is required').max(100, 'Country must be at most 100 characters'),
  engineSize: yup.string().max(50, 'Engine Size must be at most 50 characters'),
  vin: yup.string().max(17, 'VIN must be exactly 17 characters').matches(/^[A-HJ-NPR-Z0-9]{17}$/i, 'VIN must be 17 alphanumeric characters (no I, O, Q)'),
  price: yup.number().required('Price is required').min(0),
  mileage: yup.number().required('Mileage is required').min(0),
  transmissionType: yup.string().required('Transmission Type is required'),
  fuelType: yup.string().required('Fuel Type is required'),
  dealerId: yup.number().required('branche is required'),
  status: yup.string().required('Status is required'),
  registrationType: yup.string().required('Registration Type is required'),
  registrationNumber: yup.string().when('registrationType', {
    is: 'Registered',
    then: (schema) => schema.required('Registration Number is required').max(100, 'Registration Number must be at most 100 characters'),
    otherwise: (schema) => schema.notRequired()
  }),
  numberPlate: yup.string().when('registrationType', {
    is: 'Registered',
    then: (schema) => schema.required('Number Plate is required').max(50, 'Number Plate must be at most 50 characters'),
    otherwise: (schema) => schema.notRequired()
  }),
  registrationDate: yup.string().when('registrationType', {
    is: 'Registered',
    then: (schema) => schema.required('Registration Date is required'),
    otherwise: (schema) => schema.notRequired()
  }),
  numberOfPreviousOwners: yup.number().when('registrationType', {
    is: 'Registered',
    then: (schema) => schema.required('Number of Previous Owners is required').min(0),
    otherwise: (schema) => schema.notRequired()
  }),
  chassisNumber: yup.string().when('registrationType', {
    is: 'Unregistered',
    then: (schema) => schema.required('Chassis Number is required').min(17, 'Chassis Number must be 17 characters').max(17, 'Chassis Number must be 17 characters'),
    otherwise: (schema) => schema.notRequired()
  }),
  engineNumber: yup.string().when('registrationType', {
    is: 'Unregistered',
    then: (schema) => schema.required('Engine Number is required').max(100, 'Engine Number must be at most 100 characters'),
    otherwise: (schema) => schema.notRequired()
  }),
  auctionGrade: yup.string().max(10, 'Auction Grade must be at most 10 characters'),
  importYear: yup.number().when('registrationType', {
    is: 'Unregistered',
    then: (schema) => schema.required('Import Year is required').min(1900).max(new Date().getFullYear()),
    otherwise: (schema) => schema.notRequired()
  })
});

export default function VehicleRegisterForm() {
  const router = useRouter();
  const { dealers, isLoading: dealersLoading } = useGetDealers();
  const [categorizedImages, setCategorizedImages] = useState<CategorizedImages>({
    frontView: null,
    rearView: null,
    leftSideView: null,
    rightSideView: null,
    interior: null,
    engine: null,
    dashboard: null,
    others: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      make: '',
      model: '',
      subModel: '',
      vehicleType: 'Car',
      year: new Date().getFullYear(),
      color: '',
      countryOfOrigin: '',
      price: 0,
      mileage: 0,
      transmissionType: 'Automatic',
      fuelType: 'Gasoline',
      dealerId: dealers.length > 0 ? dealers[0].id : 0,
      status: 'Available',
      registrationType: 'Registered',
      engineSize: '',
      vin: '',
      registrationNumber: '',
      numberPlate: '',
      registrationDate: '',
      numberOfPreviousOwners: 0,
      chassisNumber: '',
      engineNumber: '',
      importYear: new Date().getFullYear(),
      auctionGrade: '',
      description: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        // Prepare the complete vehicle data (without images)
        const vehicleData = {
          make: values.make,
          model: values.model,
          subModel: values.subModel || null,
          vehicleType: values.vehicleType,
          year: Number(values.year),
          color: values.color,
          countryOfOrigin: values.countryOfOrigin,
          fuelType: values.fuelType,
          mileage: Number(values.mileage),
          transmissionType: values.transmissionType,
          engineSize: values.engineSize || null,
          vin: values.vin || null,
          registrationType: values.registrationType,
          price: Number(values.price),
          dealerId: Number(values.dealerId),
          status: values.status,
          description: values.description || null,
          // Handle registration type specific fields
          registeredDetails: values.registrationType === 'Registered' ? {
            registrationNumber: values.registrationNumber,
            numberPlate: values.numberPlate,
            registrationDate: values.registrationDate,
            numberOfPreviousOwners: Number(values.numberOfPreviousOwners)
          } : undefined,
          unregisteredDetails: values.registrationType === 'Unregistered' ? {
            chassisNumber: values.chassisNumber,
            engineNumber: values.engineNumber,
            importYear: Number(values.importYear),
            auctionGrade: values.auctionGrade
          } : undefined
        };

        // Step 1: Create the vehicle first
        const result = await createVehicle(vehicleData as any);
        
        if (result.success) {
          // Step 2: Upload images if vehicle creation was successful
          const vehicleId = result.data?.vehicle?.id;
          
          if (vehicleId) {
            const imageUploadResult = await uploadVehicleImages(vehicleId, categorizedImages);
            
            if (!imageUploadResult.success) {
              console.warn('Vehicle created but image upload failed:', imageUploadResult.error);
            }
          }
          
          openSnackbar({
            open: true,
            message: 'Vehicle registered successfully!',
            variant: 'alert',
            alert: {
              color: 'success',
              variant: 'filled'
            },
            close: true
          } as any);
          
          // Refresh vehicle table data
          mutate('vehicles');
          // Redirect to vehicles list after a short delay
          setTimeout(() => {
            router.push('/tables/vehicles');
          }, 1000);
        } else {
          openSnackbar({
            open: true,
            message: result.error || 'Failed to register vehicle',
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

  const handleImageUpload = (category: keyof CategorizedImages) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (category === 'others') {
        setCategorizedImages((prev) => ({
          ...prev,
          others: [...prev.others, file]
        }));
      } else {
        setCategorizedImages((prev) => ({
          ...prev,
          [category]: file
        }));
      }
    }
  };

  const handleRemoveImage = (category: keyof CategorizedImages, index?: number) => {
    if (category === 'others' && index !== undefined) {
      setCategorizedImages((prev) => ({
        ...prev,
        others: prev.others.filter((_, i) => i !== index)
      }));
    } else {
      setCategorizedImages((prev) => ({
        ...prev,
        [category]: null
      }));
    }
  };

  const renderImageUpload = (category: keyof CategorizedImages, label: string, isMultiple = false) => {
    const image = category === 'others' ? null : categorizedImages[category];
    
    return (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category}>
        <Stack sx={{ gap: 1 }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Button
            variant="outlined"
            component="label"
            size="small"
            startIcon={<Gallery />}
            fullWidth
          >
            Upload
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload(category)}
            />
          </Button>
          {image && (
            <Card sx={{ position: 'relative', mt: 1 }}>
              <CardMedia
                component="img"
                height="150"
                image={URL.createObjectURL(image)}
                alt={label}
                sx={{ objectFit: 'cover' }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' }
                }}
                size="small"
                onClick={() => handleRemoveImage(category)}
              >
                <CloseCircle size={16} />
              </IconButton>
              <Typography variant="caption" sx={{ display: 'block', p: 1, textAlign: 'center' }}>
                {image.name}
              </Typography>
            </Card>
          )}
        </Stack>
      </Grid>
    );
  };

  return (
    <MainCard>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="text" color="secondary" startIcon={<ArrowLeft />} onClick={() => router.back()}>
            Back to Vehicles
          </Button>
        </Stack>

        <Typography variant="h4">Register New Vehicle</Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* A. Vehicle Basic Information */}
            <Grid size={12}>
              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                A. Vehicle Basic Information
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Make *</InputLabel>
                <TextField
                  name="make"
                  placeholder="e.g., Toyota, Honda, BMW"
                  value={formik.values.make}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.make && Boolean(formik.errors.make)}
                  helperText={formik.touched.make && formik.errors.make}
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Model *</InputLabel>
                <TextField
                  name="model"
                  placeholder="e.g., Camry, Accord, X5"
                  value={formik.values.model}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.model && Boolean(formik.errors.model)}
                  helperText={formik.touched.model && formik.errors.model}
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Sub Model</InputLabel>
                <TextField
                  name="subModel"
                  placeholder="e.g., Sport, Limited, Premium"
                  value={formik.values.subModel}
                  onChange={formik.handleChange}
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Vehicle Type *</InputLabel>
                <FormControl fullWidth>
                  <Select
                    name="vehicleType"
                    value={formik.values.vehicleType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
                  >
                    <MenuItem value="Car">Car</MenuItem>
                    <MenuItem value="SUV">SUV</MenuItem>
                    <MenuItem value="Van">Van</MenuItem>
                    <MenuItem value="Bus">Bus</MenuItem>
                    <MenuItem value="Lorry">Lorry</MenuItem>
                    <MenuItem value="Truck">Truck</MenuItem>
                  </Select>
                  {formik.touched.vehicleType && formik.errors.vehicleType && (
                    <FormHelperText error>{formik.errors.vehicleType}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Manufactured Year *</InputLabel>
                <TextField
                  name="year"
                  type="number"
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.year && Boolean(formik.errors.year)}
                  helperText={formik.touched.year && formik.errors.year}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Color *</InputLabel>
                <TextField
                  name="color"
                  placeholder="e.g., Silver, Black, White"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.color && Boolean(formik.errors.color)}
                  helperText={formik.touched.color && formik.errors.color}
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Country of Origin *</InputLabel>
                <TextField
                  name="countryOfOrigin"
                  placeholder="e.g., Japan, Germany, USA"
                  value={formik.values.countryOfOrigin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.countryOfOrigin && Boolean(formik.errors.countryOfOrigin)}
                  helperText={formik.touched.countryOfOrigin && formik.errors.countryOfOrigin}
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Fuel Type *</InputLabel>
                <FormControl fullWidth>
                  <Select
                    name="fuelType"
                    value={formik.values.fuelType}
                    onChange={formik.handleChange}
                    error={formik.touched.fuelType && Boolean(formik.errors.fuelType)}
                  >
                    <MenuItem value="Gasoline">Gasoline</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                    <MenuItem value="Plug-in Hybrid">Plug-in Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

           <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Mileage *</InputLabel>
                <TextField
                  name="mileage"
                  type="number"
                  placeholder="e.g., 25000"
                  value={formik.values.mileage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mileage && Boolean(formik.errors.mileage)}
                  helperText={formik.touched.mileage && formik.errors.mileage}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Engine Size (Optional)</InputLabel>
                <TextField
                  name="engineSize"
                  placeholder="e.g., 2.0L, 1500cc"
                  value={formik.values.engineSize}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  inputProps={{ maxLength: 50 }}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>VIN (Optional)</InputLabel>
                <TextField
                  name="vin"
                  placeholder="17-character VIN"
                  value={formik.values.vin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.vin && Boolean(formik.errors.vin)}
                  helperText={formik.touched.vin && formik.errors.vin}
                  inputProps={{ maxLength: 17 }}
                  fullWidth
                />
              </Stack>
            </Grid>

            {/* B. Registration Type */}
            <Grid size={12}>
              <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
                B. Registration Type
              </Typography>
              <Divider />
            </Grid>

            <Grid size={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Registration Status *</FormLabel>
                <RadioGroup
                  row
                  name="registrationType"
                  value={formik.values.registrationType}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value="Registered" control={<Radio />} label="Registered" />
                  <FormControlLabel value="Unregistered" control={<Radio />} label="Unregistered" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Registered Vehicle Fields */}
            {formik.values.registrationType === 'Registered' && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Registration Number *</InputLabel>
                    <TextField
                      name="registrationNumber"
                      placeholder="e.g., ABC-1234"
                      value={formik.values.registrationNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.registrationNumber && Boolean(formik.errors.registrationNumber)}
                      helperText={formik.touched.registrationNumber && formik.errors.registrationNumber}
                      inputProps={{ maxLength: 100 }}
                      fullWidth
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Number Plate *</InputLabel>
                    <TextField
                      name="numberPlate"
                      placeholder="e.g., XYZ 789"
                      value={formik.values.numberPlate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.numberPlate && Boolean(formik.errors.numberPlate)}
                      helperText={formik.touched.numberPlate && formik.errors.numberPlate}
                      inputProps={{ maxLength: 50 }}
                      fullWidth
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Registration Date *</InputLabel>
                    <TextField
                      name="registrationDate"
                      type="date"
                      value={formik.values.registrationDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.registrationDate && Boolean(formik.errors.registrationDate)}
                      helperText={formik.touched.registrationDate && formik.errors.registrationDate}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Number of Previous Owners *</InputLabel>
                    <TextField
                      name="numberOfPreviousOwners"
                      type="number"
                      value={formik.values.numberOfPreviousOwners}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.numberOfPreviousOwners && Boolean(formik.errors.numberOfPreviousOwners)}
                      helperText={formik.touched.numberOfPreviousOwners && formik.errors.numberOfPreviousOwners}
                      fullWidth
                    />
                  </Stack>
                </Grid>
              </>
            )}

            {/* Unregistered Vehicle Fields */}
            {formik.values.registrationType === 'Unregistered' && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Chassis Number *</InputLabel>
                    <TextField
                      name="chassisNumber"
                      placeholder="17-character chassis number"
                      value={formik.values.chassisNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.chassisNumber && Boolean(formik.errors.chassisNumber)}
                      helperText={formik.touched.chassisNumber && formik.errors.chassisNumber}
                      inputProps={{ maxLength: 17 }}
                      fullWidth
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Engine Number *</InputLabel>
                    <TextField
                      name="engineNumber"
                      placeholder="Engine identification number"
                      value={formik.values.engineNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.engineNumber && Boolean(formik.errors.engineNumber)}
                      helperText={formik.touched.engineNumber && formik.errors.engineNumber}
                      inputProps={{ maxLength: 100 }}
                      fullWidth
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Import Year *</InputLabel>
                    <TextField
                      name="importYear"
                      type="number"
                      value={formik.values.importYear}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.importYear && Boolean(formik.errors.importYear)}
                      helperText={formik.touched.importYear && formik.errors.importYear}
                      fullWidth
                    />
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Auction Grade (Optional)</InputLabel>
                    <TextField
                      name="auctionGrade"
                      placeholder="e.g., 4.5, 5.0"
                      value={formik.values.auctionGrade}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.auctionGrade && Boolean(formik.errors.auctionGrade)}
                      helperText={formik.touched.auctionGrade && formik.errors.auctionGrade}
                      inputProps={{ maxLength: 10 }}
                      fullWidth
                    />
                  </Stack>
                </Grid>
              </>
            )}

            {/* C. Pricing & Assignment */}
            <Grid size={12}>
              <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
                C. Pricing & Assignment
              </Typography>
              <Divider />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Price (LKR) *</InputLabel>
                <TextField
                  name="price"
                  type="number"
                  placeholder="35000"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  fullWidth
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Transmission Type *</InputLabel>
                <FormControl fullWidth>
                  <Select
                    name="transmissionType"
                    value={formik.values.transmissionType}
                    onChange={formik.handleChange}
                    error={formik.touched.transmissionType && Boolean(formik.errors.transmissionType)}
                  >
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                    <MenuItem value="CVT">CVT</MenuItem>
                    <MenuItem value="Semi-Automatic">Semi-Automatic</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Assign to branche *</InputLabel>
                <FormControl fullWidth>
                  <Select
                    name="dealerId"
                    value={formik.values.dealerId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.dealerId && Boolean(formik.errors.dealerId)}
                    disabled={dealersLoading || dealers.length === 0}
                  >
                    {dealersLoading ? (
                      <MenuItem value={0}>Loading branches...</MenuItem>
                    ) : dealers.length === 0 ? (
                      <MenuItem value={0}>No branches available</MenuItem>
                    ) : (
                      dealers.map((dealer) => (
                        <MenuItem key={dealer.id} value={dealer.id}>{dealer.name}</MenuItem>
                      ))
                    )}
                  </Select>
                  {formik.touched.dealerId && formik.errors.dealerId && (
                    <FormHelperText error>{formik.errors.dealerId}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Status *</InputLabel>
                <FormControl fullWidth>
                  <Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                  >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Reserved">Reserved</MenuItem>
                    <MenuItem value="Sold">Sold</MenuItem>
                    <MenuItem value="Transferred">Transferred</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Description (Optional)</InputLabel>
                <TextField
                  name="description"
                  placeholder="Additional details about the vehicle..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Stack>
            </Grid>

            {/* D. Vehicle Photos */}
            <Grid size={12}>
              <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
                D. Vehicle Photos
              </Typography>
              <Divider />
            </Grid>

            {renderImageUpload('frontView', 'Front View')}
            {renderImageUpload('rearView', 'Rear View')}
            {renderImageUpload('leftSideView', 'Left Side View')}
            {renderImageUpload('rightSideView', 'Right Side View')}
            {renderImageUpload('interior', 'Interior')}
            {renderImageUpload('engine', 'Engine')}
            {renderImageUpload('dashboard', 'Dashboard')}

            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <Typography variant="subtitle2">Additional Photos</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<Gallery />}
                  sx={{ width: 'fit-content' }}
                >
                  Upload More
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload('others')}
                  />
                </Button>

                {categorizedImages.others.length > 0 && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {categorizedImages.others.map((imageFile, index) => (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                        <Card sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="120"
                            image={URL.createObjectURL(imageFile)}
                            alt={`Additional ${index + 1}`}
                            sx={{ objectFit: 'cover' }}
                          />
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'background.paper',
                              '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' }
                            }}
                            size="small"
                            onClick={() => handleRemoveImage('others', index)}
                          >
                            <CloseCircle size={16} />
                          </IconButton>
                          <Typography variant="caption" sx={{ display: 'block', p: 0.5, textAlign: 'center' }}>
                            {imageFile.name}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
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
                  setCategorizedImages({
                    frontView: null,
                    rearView: null,
                    leftSideView: null,
                    rightSideView: null,
                    interior: null,
                    engine: null,
                    dashboard: null,
                    others: []
                  });
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
                  {isSubmitting ? 'Registering...' : 'Register Vehicle'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </MainCard>
  );
}
