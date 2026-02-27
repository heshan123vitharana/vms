'use client';

import { use, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';

// project-imports
import MainCard from 'components/MainCard';
import { useGetVehicle } from 'api/vehicle';

// assets
import { ArrowLeft, ArrowLeft2, ArrowRight2, Car } from '@wandersonalwes/iconsax-react';

// next
import { useRouter } from 'next/navigation';

// types
import { Vehicle, VehicleStatus } from 'types/vehicle';

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

// Data row component
function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <TableRow>
      <TableCell component="th" scope="row" sx={{ fontWeight: 600, width: '40%' }}>
        {label}
      </TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );
}

export default function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const vehicleId = parseInt(resolvedParams.id);
  
  // Get vehicle data from API
  const { vehicle, vehicleLoading, vehicleError } = useGetVehicle(vehicleId);

  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all available images for the vehicle
  const getVehicleImages = (vehicle: Vehicle | undefined) => {
    if (!vehicle?.images) return [];
    const imageArray: { url: string; label: string }[] = [];
    if (vehicle.images.frontView) imageArray.push({ url: vehicle.images.frontView, label: 'Front View' });
    if (vehicle.images.rearView) imageArray.push({ url: vehicle.images.rearView, label: 'Rear View' });
    if (vehicle.images.leftSideView) imageArray.push({ url: vehicle.images.leftSideView, label: 'Left Side' });
    if (vehicle.images.rightSideView) imageArray.push({ url: vehicle.images.rightSideView, label: 'Right Side' });
    if (vehicle.images.interior) imageArray.push({ url: vehicle.images.interior, label: 'Interior' });
    if (vehicle.images.dashboard) imageArray.push({ url: vehicle.images.dashboard, label: 'Dashboard' });
    if (vehicle.images.engine) imageArray.push({ url: vehicle.images.engine, label: 'Engine' });
    if (vehicle.images.others) {
      vehicle.images.others.forEach((url, index) => {
        imageArray.push({ url, label: `Additional ${index + 1}` });
      });
    }
    return imageArray;
  };

  const vehicleImages = getVehicleImages(vehicle);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? vehicleImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === vehicleImages.length - 1 ? 0 : prev + 1));
  };

  // Loading state
  if (vehicleLoading) {
    return (
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Error state
  if (vehicleError || !vehicle) {
    return (
      <MainCard>
        <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
          <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
            {vehicleError ? 'Failed to load vehicle details.' : 'Vehicle not found.'}
          </Alert>
          <Button variant="contained" startIcon={<ArrowLeft />} onClick={() => router.back()}>
            Back
          </Button>
        </Stack>
      </MainCard>
    );
  }

  return (
    <MainCard>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button variant="text" color="secondary" startIcon={<ArrowLeft />} onClick={() => router.back()}>
            Back
          </Button>
          <StatusChip status={vehicle.status} />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h3">{vehicle.make} {vehicle.model} {vehicle.subModel || ''}</Typography>
          <Typography variant="h4" color="primary">LKR {vehicle.price.toLocaleString()}</Typography>
        </Stack>

        <Divider />

        <Grid container spacing={3}>
          {/* Left Column - Vehicle Images */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Vehicle Photos</Typography>
              
              {/* Image Carousel */}
              {vehicleImages.length > 0 ? (
                <Box>
                  {/* Main Image Display */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: 400,
                      borderRadius: 2,
                      overflow: 'hidden',
                      bgcolor: 'grey.100',
                      mb: 2
                    }}
                  >
                    <Image
                      src={vehicleImages[currentImageIndex].url}
                      alt={vehicleImages[currentImageIndex].label}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                    <Chip
                      label={vehicleImages[currentImageIndex].label}
                      size="small"
                      sx={{ position: 'absolute', bottom: 16, left: 16 }}
                    />

                    {/* Navigation Buttons */}
                    {vehicleImages.length > 1 && (
                      <>
                        <IconButton
                          onClick={handlePrevImage}
                          sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 1)'
                            }
                          }}
                        >
                          <ArrowLeft2 />
                        </IconButton>
                        <IconButton
                          onClick={handleNextImage}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 1)'
                            }
                          }}
                        >
                          <ArrowRight2 />
                        </IconButton>
                      </>
                    )}

                    {/* Image Counter */}
                    {vehicleImages.length > 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.875rem'
                        }}
                      >
                        {currentImageIndex + 1} / {vehicleImages.length}
                      </Box>
                    )}
                  </Box>

                  {/* Thumbnail Strip */}
                  {vehicleImages.length > 1 && (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        overflowX: 'auto',
                        pb: 1,
                        '&::-webkit-scrollbar': {
                          height: 6
                        },
                        '&::-webkit-scrollbar-track': {
                          bgcolor: 'grey.200',
                          borderRadius: 3
                        },
                        '&::-webkit-scrollbar-thumb': {
                          bgcolor: 'grey.400',
                          borderRadius: 3,
                          '&:hover': {
                            bgcolor: 'grey.500'
                          }
                        }
                      }}
                    >
                      {vehicleImages.map((image, index) => (
                        <Box
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          sx={{
                            position: 'relative',
                            minWidth: 80,
                            height: 60,
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: currentImageIndex === index ? '3px solid' : '2px solid',
                            borderColor: currentImageIndex === index ? 'primary.main' : 'grey.300',
                            opacity: currentImageIndex === index ? 1 : 0.6,
                            transition: 'all 0.2s',
                            '&:hover': {
                              opacity: 1,
                              borderColor: 'primary.main'
                            }
                          }}
                        >
                          <Image
                            src={image.url}
                            alt={image.label}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                    borderRadius: 2
                  }}
                >
                  <Stack alignItems="center" spacing={1}>
                    <Car size={64} style={{ opacity: 0.3 }} />
                    <Typography variant="body2" color="text.secondary">
                      No images available
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Right Column - Vehicle Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h5" gutterBottom>Basic Information</Typography>
                <Table size="small">
                  <TableBody>
                    <DataRow label="Stock Number" value={vehicle.stockNumber} />
                    <DataRow label="Make" value={vehicle.make} />
                    <DataRow label="Model" value={vehicle.model} />
                    {vehicle.subModel && <DataRow label="Sub Model" value={vehicle.subModel} />}
                    <DataRow label="Vehicle Type" value={vehicle.vehicleType} />
                    <DataRow label="Year" value={vehicle.year} />
                    <DataRow label="Color" value={vehicle.color} />
                    <DataRow label="Country of Origin" value={vehicle.countryOfOrigin} />
                    <DataRow label="Fuel Type" value={vehicle.fuelType} />
                    <DataRow label="Transmission" value={vehicle.transmissionType} />
                    {vehicle.engineSize && <DataRow label="Engine Size" value={vehicle.engineSize} />}
                    <DataRow label="Mileage" value={`${vehicle.mileage.toLocaleString()} miles`} />
                    {vehicle.vin && <DataRow label="VIN" value={vehicle.vin} />}
                  </TableBody>
                </Table>
              </Box>

              {/* Registration Information */}
              <Box>
                <Typography variant="h5" gutterBottom>Registration Information</Typography>
                <Table size="small">
                  <TableBody>
                    <DataRow 
                      label="Registration Type" 
                      value={
                        <Chip 
                          label={vehicle.registrationType} 
                          size="small" 
                          color={vehicle.registrationType === 'Registered' ? 'primary' : 'default'}
                          variant="outlined"
                        />
                      } 
                    />
                    
                    {vehicle.registrationType === 'Registered' && vehicle.registeredDetails && (
                      <>
                        <DataRow label="Registration Number" value={vehicle.registeredDetails.registrationNumber} />
                        <DataRow label="Number Plate" value={vehicle.registeredDetails.numberPlate} />
                        <DataRow label="Registration Date" value={new Date(vehicle.registeredDetails.registrationDate).toLocaleDateString()} />
                        <DataRow label="Previous Owners" value={vehicle.registeredDetails.numberOfPreviousOwners} />
                      </>
                    )}

                    {vehicle.registrationType === 'Unregistered' && vehicle.unregisteredDetails && (
                      <>
                        <DataRow label="Chassis Number" value={vehicle.unregisteredDetails.chassisNumber} />
                        <DataRow label="Engine Number" value={vehicle.unregisteredDetails.engineNumber} />
                        <DataRow label="Import Year" value={vehicle.unregisteredDetails.importYear} />
                        {vehicle.unregisteredDetails.auctionGrade && (
                          <DataRow label="Auction Grade" value={vehicle.unregisteredDetails.auctionGrade} />
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </Box>

              {/* Assignment & Pricing */}
              <Box>
                <Typography variant ="h5" gutterBottom>Assignment & Pricing</Typography>
                <Table size="small">
                  <TableBody>
                    <DataRow label="Price" value={`LKR ${vehicle.price.toLocaleString()}`} />
                    {vehicle.tenant && <DataRow label="Tenant" value={vehicle.tenant} />}
                    <DataRow label="Assigned branche" value={vehicle.dealer} />
                    <DataRow label="Status" value={<StatusChip status={vehicle.status} />} />
                  </TableBody>
                </Table>
              </Box>

              {/* Description */}
              {vehicle.description && (
                <Box>
                  <Typography variant="h5" gutterBottom>Description</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {vehicle.description}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
}
