'use client';

import { ReactNode } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import EcommerceDataChart from './EcommerceDataChart';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// assets
import { ArrowUp, ArrowDown } from '@wandersonalwes/iconsax-react';

// types
import { ColorProps } from 'types/extended';

interface VehicleStatCardProps {
  title: string;
  count: string | number;
  percentage: number;
  isIncrease?: boolean;
  color?: ColorProps;
  iconPrimary: ReactNode;
}

// ==============================|| CHART WIDGETS - VEHICLE STAT CARD ||============================== //

export default function VehicleStatCard({ 
  title, 
  count, 
  percentage, 
  isIncrease = true, 
  color,
  iconPrimary
}: VehicleStatCardProps) {
  const theme = useTheme();

  const getChartColor = () => {
    if (!color) return theme.palette.primary.main;
    
    const validColors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
    if (validColors.includes(color as any)) {
      return theme.palette[color as typeof validColors[number]].main;
    }
    return theme.palette.primary.main;
  };

  const chartColor = getChartColor();

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
              <Avatar variant="rounded" color={color}>
                {iconPrimary}
              </Avatar>
              <Typography variant="subtitle1">{title}</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid size={12}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Box sx={{ p: 3, pb: 1.25 }}>
              <Grid container spacing={3}>
                <Grid size={7}>
                  <EcommerceDataChart color={chartColor} />
                </Grid>
                <Grid size={5}>
                  <Stack sx={{ gap: 1 }}>
                    <Typography variant="h5">{typeof count === 'number' ? count.toLocaleString() : count}</Typography>
                    <Typography 
                      sx={{ 
                        color: isIncrease ? 'success.main' : 'error.main', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        fontWeight: 500 
                      }}
                    >
                      {isIncrease ? (
                        <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} />
                      ) : (
                        <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} />
                      )}
                      {percentage}%
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}
