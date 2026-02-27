'use client';

import { use } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// project-imports
import { useGetPublicVehicle } from 'api/vehicle';
import FooterBlock from 'layout/SimpleLayout/FooterBlock';

// assets
import { ArrowLeft, Car } from '@wandersonalwes/iconsax-react';

// next
import Link from 'next/link';

// types
import { VehicleStatus } from 'types/vehicle';

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
  const resolvedParams = use(params);
  const vehicleId = parseInt(resolvedParams.id);
  
  // Get vehicle data from API (public endpoint - limited data)
  const { vehicle, vehicleLoading, vehicleError } = useGetPublicVehicle(vehicleId);

  // Loading state
  if (vehicleLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ flex: 1, py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        </Container>
        <FooterBlock />
      </Box>
    );
  }

  // Error state
  if (vehicleError || !vehicle) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ flex: 1, py: 8 }}>
          <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
            <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
              {vehicleError ? 'Failed to load vehicle details.' : 'Vehicle not found.'}
            </Alert>
            <Button 
              variant="contained" 
              startIcon={<ArrowLeft />} 
              component={Link}
              href="/find-vehicle"
            >
              Back to Vehicles
            </Button>
          </Stack>
        </Container>
        <FooterBlock />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Button 
                variant="text" 
                color="secondary" 
                startIcon={<ArrowLeft />} 
                component={Link}
                href="/find-vehicle"
              >
                Back to Vehicles
              </Button>
              <StatusChip status={vehicle.status} />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Typography variant="h3">
                {vehicle.make} {vehicle.model} {vehicle.subModel || ''}
              </Typography>
              <Typography variant="h4" color="primary">
                LKR {vehicle.price.toLocaleString()}
              </Typography>
            </Stack>

            <Divider />

            <Grid container spacing={3}>
              {/* Left Column - Vehicle Images */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="h5">Vehicle Photos</Typography>
                  
                  {vehicle.images?.frontView && (
                    <Card>
                      <Typography variant="subtitle2" sx={{ p: 1, bgcolor: 'background.default' }}>
                        Front View
                      </Typography>
                      <CardMedia
                        component="img"
                        height="250"
                        image={vehicle.images.frontView}
                        alt="Front view"
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  )}

                  <Grid container spacing={2}>
                    {vehicle.images?.rearView && (
                      <Grid size={6}>
                        <Card>
                          <Typography variant="caption" sx={{ p: 0.5, display: 'block', bgcolor: 'background.default', textAlign: 'center' }}>
                            Rear View
                          </Typography>
                          <CardMedia
                            component="img"
                            height="150"
                            image={vehicle.images.rearView}
                            alt="Rear view"
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </Grid>
                    )}

                    {vehicle.images?.leftSideView && (
                      <Grid size={6}>
                        <Card>
                          <Typography variant="caption" sx={{ p: 0.5, display: 'block', bgcolor: 'background.default', textAlign: 'center' }}>
                            Left Side
                          </Typography>
                          <CardMedia
                            component="img"
                            height="150"
                            image={vehicle.images.leftSideView}
                            alt="Left side"
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </Grid>
                    )}

                    {vehicle.images?.rightSideView && (
                      <Grid size={6}>
                        <Card>
                          <Typography variant="caption" sx={{ p: 0.5, display: 'block', bgcolor: 'background.default', textAlign: 'center' }}>
                            Right Side
                          </Typography>
                          <CardMedia
                            component="img"
                            height="150"
                            image={vehicle.images.rightSideView}
                            alt="Right side"
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </Grid>
                    )}

                    {vehicle.images?.interior && (
                      <Grid size={6}>
                        <Card>
                          <Typography variant="caption" sx={{ p: 0.5, display: 'block', bgcolor: 'background.default', textAlign: 'center' }}>
                            Interior
                          </Typography>
                          <CardMedia
                            component="img"
                            height="150"
                            image={vehicle.images.interior}
                            alt="Interior"
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </Grid>
                    )}

                    {vehicle.images?.engine && (
                      <Grid size={6}>
                        <Card>
                          <Typography variant="caption" sx={{ p: 0.5, display: 'block', bgcolor: 'background.default', textAlign: 'center' }}>
                            Engine
                          </Typography>
                          <CardMedia
                            component="img"
                            height="150"
                            image={vehicle.images.engine}
                            alt="Engine"
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </Grid>
                    )}

                    {vehicle.images?.dashboard && (
                      <Grid size={6}>
                        <Card>
                          <Typography variant="caption" sx={{ p: 0.5, display: 'block', bgcolor: 'background.default', textAlign: 'center' }}>
                            Dashboard
                          </Typography>
                          <CardMedia
                            component="img"
                            height="150"
                            image={vehicle.images.dashboard}
                            alt="Dashboard"
                            sx={{ objectFit: 'cover' }}
                          />
                        </Card>
                      </Grid>
                    )}
                  </Grid>

                  {vehicle.images && vehicle.images.others && vehicle.images.others.length > 0 && (
                    <Grid container spacing={2}>
                      {vehicle.images.others.map((img, index) => (
                        <Grid size={6} key={index}>
                          <Card>
                            <CardMedia
                              component="img"
                              height="150"
                              image={img}
                              alt={`Additional ${index + 1}`}
                              sx={{ objectFit: 'cover' }}
                            />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {!vehicle.images && (
                    <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Car size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        No images available
                      </Typography>
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
                        <DataRow label="Year" value={vehicle.year} />
                        <DataRow label="Color" value={vehicle.color} />
                        <DataRow label="Country of Origin" value={vehicle.countryOfOrigin} />
                        <DataRow label="Fuel Type" value={vehicle.fuelType} />
                        <DataRow label="Transmission" value={vehicle.transmissionType} />
                        <DataRow label="Mileage" value={`${vehicle.mileage.toLocaleString()} km`} />
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
                    <Typography variant="h5" gutterBottom>Assignment & Pricing</Typography>
                    <Table size="small">
                      <TableBody>
                        <DataRow label="Price" value={`LKR ${vehicle.price.toLocaleString()}`} />
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

                  {/* Contact CTA */}
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      size="large" 
                      fullWidth
                      component={Link}
                      href="/contact-us"
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      Contact Us About This Vehicle
                    </Button>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </Container>
      
      {/* Footer */}
      <FooterBlock />
    </Box>
  );
}
