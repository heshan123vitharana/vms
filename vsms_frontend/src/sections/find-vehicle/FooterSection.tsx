'use client';

// material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// assets
import { Call, Location, Sms } from '@wandersonalwes/iconsax-react';

// ==============================|| LANDING - FOOTER SECTION ||============================== //

const branches = [
  {
    id: 1,
    name: 'Main Branch',
    address: 'Boralasgamuwa, Colombo',
    phone: '077 765 0650',
    coordinates: { lat: 40.7128, lng: -74.006 }
  },
  {
    id: 2,
    name: 'Kalubowila Branch',
    address: 'Kalubovila, Colombo',
    phone: '077 765 0650',
    coordinates: { lat: 40.7829, lng: -73.9654 }
  },
  {
    id: 3,
    name: 'Kohuwala Branch',
    address: 'Kohuwala, Colombo',
    phone: '077 765 0650',
    coordinates: { lat: 40.6501, lng: -73.9496 }
  }
];

export default function FooterSection() {
  return (
    <Box sx={{ bgcolor: 'grey.900', color: 'white', pt: { xs: 6, md: 10 }, pb: 3 }}>
      <Container>
        <Grid container spacing={4}>
          {/* Contact Details - Left Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Contact Us
            </Typography>
            
            <Stack spacing={3}>
              {/* Company Info */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Nandana Enterprises (Pvt) Ltd
                </Typography>
                <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
                  Your trusted partner for quality vehicles and comprehensive fleet management solutions across the region.
                </Typography>
              </Box>

              {/* Contact Methods */}
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Call size={20} />
                  <Link href="tel:+12345678900" color="inherit" underline="hover">
                    Phone: 077 765 0650
                  </Link>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Sms size={20} />
                  <Link href="mailto:info@rbsvsms.com" color="inherit" underline="hover">
                    info@vsms.com
                  </Link>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Location size={20} style={{ marginTop: 2 }} />
                  <Typography variant="body2" color="grey.400">
                    122 Colombo - Horana Rd,<br />
                    Boralesgamuwa 10290.
                  </Typography>
                </Stack>
              </Stack>

              {/* Branch Locations */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Our Branches
                </Typography>
                <Stack spacing={1.5}>
                  {branches.map((branch) => (
                    <Box key={branch.id}>
                      <Typography variant="subtitle2" color="primary.light">
                        {branch.name}
                      </Typography>
                      <Typography variant="body2" color="grey.400">
                        {branch.address}
                      </Typography>
                      <Typography variant="body2" color="grey.500">
                        {branch.phone}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Map - Right Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Find Us
            </Typography>
            <Box
              sx={{
                height: { xs: 300, md: 450 },
                bgcolor: 'grey.800',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid',
                borderColor: 'grey.700'
              }}
            >
              {/* Map Placeholder */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3
                }}
              >
                <Location size={60} variant="Bulk" style={{ marginBottom: 16, opacity: 0.5 }} />
                <Typography variant="h6" color="grey.400" sx={{ mb: 1 }}>
                  Interactive Map
                </Typography>
                <Typography variant="body2" color="grey.500" textAlign="center">
                  Map showing main branch and sub-branches locations<br />
                  (Google Maps integration can be added here)
                </Typography>
                
                {/* Sample branch markers */}
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  {branches.map((branch, index) => (
                    <Box
                      key={branch.id}
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: index === 0 ? 'primary.main' : 'secondary.main',
                        borderRadius: 1,
                        fontSize: '0.75rem'
                      }}
                    >
                      {branch.name}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'grey.700', textAlign: 'center' }}>
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} RBS Vehicle Management System. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
