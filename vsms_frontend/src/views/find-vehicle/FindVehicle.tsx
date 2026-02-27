'use client';

import React, { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';

// project-imports
import { useGetVehicles } from 'api/vehicle';
import FooterSection from 'sections/find-vehicle/FooterSection';

// assets
import { Car, SearchNormal1, Filter, ArrowLeft2, ArrowRight2, CloseCircle, Truck, Bus, ShoppingCart } from '@wandersonalwes/iconsax-react';

// next
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// types
import { Vehicle } from 'types/vehicle';

// ==============================|| FIND VEHICLE PAGE ||============================== //

export default function FindVehiclePage() {
  const router = useRouter();
  const { vehicles, vehiclesLoading, vehiclesError } = useGetVehicles();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const itemsPerPage = 12;

  // Filter vehicles based on search and filters
  const filteredVehicles = vehicles.filter((vehicle: Vehicle) => {
    const matchesSearch = searchTerm === '' || 
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.stockNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMake = makeFilter === '' || vehicle.make === makeFilter;
    const matchesVehicleType = vehicleTypeFilter === '' || vehicle.vehicleType === vehicleTypeFilter;
    const matchesFuelType = fuelTypeFilter === '' || vehicle.fuelType === fuelTypeFilter;
    const matchesTransmission = transmissionFilter === '' || vehicle.transmissionType === transmissionFilter;
    const matchesMinYear = minYear === '' || vehicle.year >= parseInt(minYear);
    const matchesMaxYear = maxYear === '' || vehicle.year <= parseInt(maxYear);
    const matchesMinPrice = minPrice === '' || vehicle.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || vehicle.price <= parseFloat(maxPrice);
    
    return matchesSearch && matchesMake && matchesVehicleType && matchesFuelType && matchesTransmission && matchesMinYear && matchesMaxYear && matchesMinPrice && matchesMaxPrice;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Get unique values for filters
  const uniqueMakes = Array.from(new Set(vehicles.map((v: Vehicle) => v.make))).sort();
  const uniqueFuelTypes = Array.from(new Set(vehicles.map((v: Vehicle) => v.fuelType))).sort();
  const uniqueTransmissions = Array.from(new Set(vehicles.map((v: Vehicle) => v.transmissionType))).sort();

  // Format price
  const formatPrice = (price: number) => {
    try {
      return `LKR ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(price)}`;
    } catch (error) {
      return `LKR ${price}`;
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedVehicle(null);
    setCurrentImageIndex(0);
  };

  // Get all available images for the selected vehicle
  const getVehicleImages = (vehicle: Vehicle | null) => {
    if (!vehicle?.images) return [];
    const imageArray: { url: string; label: string }[] = [];
    if (vehicle.images.frontView) imageArray.push({ url: vehicle.images.frontView, label: 'Front View' });
    if (vehicle.images.rearView) imageArray.push({ url: vehicle.images.rearView, label: 'Rear View' });
    if (vehicle.images.leftSideView) imageArray.push({ url: vehicle.images.leftSideView, label: 'Left Side' });
    if (vehicle.images.rightSideView) imageArray.push({ url: vehicle.images.rightSideView, label: 'Right Side' });
    if (vehicle.images.interior) imageArray.push({ url: vehicle.images.interior, label: 'Interior' });
    if (vehicle.images.dashboard) imageArray.push({ url: vehicle.images.dashboard, label: 'Dashboard' });
    if (vehicle.images.engine) imageArray.push({ url: vehicle.images.engine, label: 'Engine' });
    return imageArray;
  };

  const vehicleImages = getVehicleImages(selectedVehicle);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? vehicleImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === vehicleImages.length - 1 ? 0 : prev + 1));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setMakeFilter('');
    setVehicleTypeFilter('');
    setFuelTypeFilter('');
    setTransmissionFilter('');
    setMinYear('');
    setMaxYear('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  return (
    <Box>
      {/* Main Content */}
      <Box sx={{ bgcolor: 'background.paper', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          {/* Back to Home Button */}
          <Box sx={{ mb: 3 }}>            <Link href="/admin-dashboard" passHref legacyBehavior>
              <Button
                component="a"
                startIcon={<ArrowLeft2 size={20} />}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'primary.main'
                  }
                }}
              >
                Back to dashboard
              </Button>
            </Link>
          </Box>

          {/* Vehicle Type Filter Boxes */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} justifyContent="center">
              {[
                { type: 'Car', icon: Car },
                { type: 'SUV', icon: Car },
                { type: 'Van', icon: Truck },
                { type: 'Bus', icon: Bus },
                { type: 'Lorry', icon: Truck },
                { type: 'Truck', icon: Truck },
              ].map((vehicleType) => {
                const IconComponent = vehicleType.icon;
                const isSelected = vehicleTypeFilter === vehicleType.type;
                return (
                  <Grid key={vehicleType.type} size={{ xs: 6, sm: 4, md: 2 }}>
                    <Box
                      onClick={() => setVehicleTypeFilter(isSelected ? '' : vehicleType.type)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 120,
                        border: 2,
                        borderColor: isSelected ? 'primary.main' : 'grey.300',
                        borderRadius: 2,
                        bgcolor: isSelected ? 'primary.main' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: isSelected ? 'primary.main' : 'primary.lighter',
                          transform: 'translateY(-4px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <IconComponent
                        size={48}
                        variant={isSelected ? 'Bold' : 'Outline'}
                        style={{ color: isSelected ? '#fff' : undefined }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          fontWeight: 600,
                          color: isSelected ? 'white' : 'text.primary'
                        }}
                      >
                        {vehicleType.type}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Filters */}
          <Card sx={{ mb: 4, p: 3, boxShadow: 2 }}>
            {/* First Row: Search and Reset Button */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  fullWidth
                  placeholder="Search by make, model, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchNormal1 size={20} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleResetFilters}
                  startIcon={<Filter />}
                  sx={{ height: '56px' }}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>

            {/* Second Row: Make, Fuel Type, Transmission, Year Range, and Price Range */}
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <FormControl fullWidth>
                  <InputLabel>Make</InputLabel>
                  <Select
                    value={makeFilter}
                    onChange={(e) => setMakeFilter(e.target.value)}
                    label="Make"
                  >
                    <MenuItem value="">All Makes</MenuItem>
                    {uniqueMakes.map((make) => (
                      <MenuItem key={make} value={make}>
                        {make}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <FormControl fullWidth>
                  <InputLabel>Fuel Type</InputLabel>
                  <Select
                    value={fuelTypeFilter}
                    onChange={(e) => setFuelTypeFilter(e.target.value)}
                    label="Fuel Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {uniqueFuelTypes.map((fuel) => (
                      <MenuItem key={fuel} value={fuel}>
                        {fuel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                <FormControl fullWidth>
                  <InputLabel>Transmission</InputLabel>
                  <Select
                    value={transmissionFilter}
                    onChange={(e) => setTransmissionFilter(e.target.value)}
                    label="Transmission"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {uniqueTransmissions.map((trans) => (
                      <MenuItem key={trans} value={trans}>
                        {trans}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} sx={{ borderLeft: { md: '1px solid rgba(0, 0, 0, 0.12)' }, pl: { md: 2 } }}>
                <Grid container spacing={1}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Min Year"
                      type="number"
                      value={minYear}
                      onChange={(e) => setMinYear(e.target.value)}
                      placeholder="2000"
                      inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Max Year"
                      type="number"
                      value={maxYear}
                      onChange={(e) => setMaxYear(e.target.value)}
                      placeholder="2024"
                      inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2.4 }} sx={{ borderLeft: { md: '1px solid rgba(0, 0, 0, 0.12)' }, pl: { md: 2 } }}>
                <Grid container spacing={1}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Min Price"
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="10000"
                      inputProps={{ min: 0, step: 1000 }}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Max Price"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="100000"
                      inputProps={{ min: 0, step: 1000 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>

          {/* Results Count */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              Showing {paginatedVehicles.length} of {filteredVehicles.length} vehicles
            </Typography>
          </Box>

          {/* Loading State */}
          {vehiclesLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {vehiclesError && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="error" variant="h6">
                Unable to load vehicles. Please try again later.
              </Typography>
            </Box>
          )}

          {/* Empty State */}
          {!vehiclesLoading && !vehiclesError && filteredVehicles.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Car size={64} style={{ marginBottom: 16, opacity: 0.3 }} />
              <Typography variant="h6" color="text.secondary">
                No vehicles found matching your criteria
              </Typography>
              <Button sx={{ mt: 2 }} onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </Box>
          )}

          {/* Vehicles Grid */}
          {!vehiclesLoading && !vehiclesError && paginatedVehicles.length > 0 && (
            <>
              <Grid container spacing={3}>
            {paginatedVehicles.map((vehicle: Vehicle) => (
                <Grid key={vehicle.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                  {/* Vehicle Image */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 200,
                      bgcolor: 'grey.100',
                      overflow: 'hidden'
                    }}
                  >
                    {vehicle.images?.frontView ? (
                      <Image
                        src={vehicle.images.frontView}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%'
                        }}
                      >
                        <Car size={48} style={{ opacity: 0.3 }} />
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {vehicle.make} {vehicle.model}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {vehicle.year} • {vehicle.color}
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        label={vehicle.fuelType}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={vehicle.transmissionType}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${vehicle.mileage?.toLocaleString()} km`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{ mt: 2, fontWeight: 600 }}
                    >
                      {formatPrice(vehicle.price)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleOpenDialog(vehicle)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      
      {/* Footer */}
      <FooterSection />

      {/* Vehicle Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedVehicle && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.5rem', fontWeight: 600 }}>
              {selectedVehicle.make} {selectedVehicle.model}
              <IconButton onClick={handleCloseDialog} sx={{ ml: 2 }}>
                <CloseCircle />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {/* Image Carousel */}
              {vehicleImages.length > 0 ? (
                <Box sx={{ mb: 3 }}>
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
                    borderRadius: 2,
                    mb: 3
                  }}
                >
                  <Car size={64} style={{ opacity: 0.3 }} />
                </Box>
              )}

              {/* Vehicle Details */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {formatPrice(selectedVehicle.price)}
                  </Typography>
                  <Chip
                    label={selectedVehicle.status}
                    size="small"
                    color={selectedVehicle.status === 'Available' ? 'success' : 'default'}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Stock Number</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.stockNumber}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Vehicle Type</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.vehicleType}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Year</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.year}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Color</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.color}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Mileage</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.mileage?.toLocaleString()} km</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Fuel Type</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.fuelType}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Transmission</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.transmissionType}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Country of Origin</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.countryOfOrigin}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Registration Type</Typography>
                  <Typography variant="body1" fontWeight={500}>{selectedVehicle.registrationType}</Typography>
                </Grid>
                {selectedVehicle.subModel && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Sub Model</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedVehicle.subModel}</Typography>
                  </Grid>
                )}
                {selectedVehicle.dealer && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Dealer</Typography>
                    <Typography variant="body1" fontWeight={500}>{selectedVehicle.dealer}</Typography>
                  </Grid>
                )}

                {selectedVehicle.registrationType === 'Registered' && selectedVehicle.registeredDetails && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>Registration Details</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">Number Plate</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedVehicle.registeredDetails.numberPlate}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">Registration Date</Typography>
                      <Typography variant="body1" fontWeight={500}>{new Date(selectedVehicle.registeredDetails.registrationDate).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">Previous Owners</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedVehicle.registeredDetails.numberOfPreviousOwners}</Typography>
                    </Grid>
                  </>
                )}

                {selectedVehicle.registrationType === 'Unregistered' && selectedVehicle.unregisteredDetails && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>Unregistered Vehicle Details</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">Import Year</Typography>
                      <Typography variant="body1" fontWeight={500}>{selectedVehicle.unregisteredDetails.importYear}</Typography>
                    </Grid>
                    {selectedVehicle.unregisteredDetails.auctionGrade && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">Auction Grade</Typography>
                        <Typography variant="body1" fontWeight={500}>{selectedVehicle.unregisteredDetails.auctionGrade}</Typography>
                      </Grid>
                    )}
                  </>
                )}

                {selectedVehicle.description && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>Description</Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body1">{selectedVehicle.description}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
<DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                Close
              </Button>
              {selectedVehicle?.status === 'Available' ? (
                <Button 
                  variant="contained" 
                  color="success"
                  startIcon={<ShoppingCart />}
                  onClick={() => {
                    handleCloseDialog();
                  router.push(`/actions/sell-car?vehicleId=${selectedVehicle.id}`);
                  }}
                >
                  Sell
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  color="inherit"
                  disabled
                >
                  {selectedVehicle?.status === 'Sold' ? 'Sold' : selectedVehicle?.status || 'Unavailable'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
