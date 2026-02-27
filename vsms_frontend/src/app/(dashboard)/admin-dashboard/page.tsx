'use client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// ==============================|| ADMIN DASHBOARD ||============================== //

export default function AdminDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Admin Dashboard
        </Typography>
      </Grid>
    </Grid>
  );
}
