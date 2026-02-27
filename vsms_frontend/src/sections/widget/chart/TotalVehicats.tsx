import { useEffect, useState, useMemo, MouseEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';
import ListItemButton from '@mui/material/ListItemButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project-imports
import Dot from 'components/@extended/Dot';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import { useGetVehicles } from 'api/vehicle';

// ==============================|| CHART ||============================== //
const pieChartOptions = {
  chart: {
    type: 'donut',
    height: 320
  },
  labels: ['Available', 'Sold', 'Transferred', 'Reserved'],
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false
  }
};

// ==============================|| CHART ||============================== //

function ApexDonutChart({ series }: { series: number[] }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const mode = theme.palette.mode;

  const { primary } = theme.palette.text;
  const line = theme.palette.divider;
  const grey200 = theme.palette.secondary[200];
  const backColor = theme.palette.background.paper;

  const [options, setOptions] = useState<ChartProps>(pieChartOptions);

  useEffect(() => {
    const primaryMain = theme.palette.primary.main;
    const primaryLighter = theme.palette.primary[100];
    const warning = theme.palette.warning.main;
    const success = theme.palette.success.main;

    setOptions((prevState) => ({
      ...prevState,
      colors: [primaryMain, warning, success, primaryLighter],
      xaxis: {
        labels: {
          style: { colors: primary }
        }
      },
      yaxis: {
        labels: {
          style: { colors: primary }
        }
      },
      grid: {
        borderColor: line
      },
      stroke: {
        colors: [backColor]
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, line, grey200, backColor, theme]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="donut" height={downSM ? 280 : 320} id="vehicle-distribution-chart" />
    </div>
  );
}

// ==============================|| CHART WIDGETS - VEHICLE DISTRIBUTION ||============================== //

export default function TotalVehicles() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { vehicles, vehiclesLoading } = useGetVehicles();

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Calculate counts by status
  const counts = useMemo(() => {
    if (!vehicles || vehicles.length === 0) {
      return { available: 0, sold: 0, transferred: 0, reserved: 0 };
    }

    return vehicles.reduce(
      (acc, vehicle) => {
        switch (vehicle.status) {
          case 'Available':
            acc.available++;
            break;
          case 'Sold':
            acc.sold++;
            break;
          case 'Transferred':
            acc.transferred++;
            break;
          case 'Reserved':
            acc.reserved++;
            break;
        }
        return acc;
      },
      { available: 0, sold: 0, transferred: 0, reserved: 0 }
    );
  }, [vehicles]);

  const series = [counts.available, counts.sold, counts.transferred, counts.reserved];

  // Show loading state
  if (vehiclesLoading) {
    return (
      <MainCard sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard sx={{ height: '100%' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5">Vehicle Distribution</Typography>
            <IconButton
              color="secondary"
              id="wallet-button"
              aria-controls={open ? 'wallet-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              id="wallet-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'wallet-button', sx: { p: 1.25, minWidth: 150 } }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <ListItemButton onClick={handleClose}>Today</ListItemButton>
              <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
              <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
            </Menu>
          </Stack>
        </Grid>
        <Grid size={12}>
          <ApexDonutChart series={series} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Stack sx={{ gap: 0.5, alignItems: 'flex-start', p: 2 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot componentDiv />
                <Typography>Available</Typography>
              </Stack>

              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {counts.available}
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  Vehicles
                </Typography>
              </Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Stack sx={{ gap: 0.5, alignItems: 'flex-start', p: 2 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot componentDiv color="warning" />
                <Typography>Sold</Typography>
              </Stack>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {counts.sold}
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  Vehicles
                </Typography>
              </Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Stack sx={{ gap: 0.5, alignItems: 'flex-start', p: 2 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot componentDiv color="success" />
                <Typography>Transferred</Typography>
              </Stack>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {counts.transferred}
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  Vehicles
                </Typography>
              </Typography>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Stack sx={{ gap: 0.5, alignItems: 'flex-start', p: 2 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <Dot componentDiv sx={{ bgcolor: 'primary.200' }} />
                <Typography>Reserved</Typography>
              </Stack>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {counts.reserved}
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  Vehicles
                </Typography>
              </Typography>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}
