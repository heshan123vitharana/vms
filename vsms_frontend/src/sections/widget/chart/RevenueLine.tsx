'use client';

import { useState, useEffect, MouseEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {}
    },
    axisBorder: {
      show: true
    }
  },
  yaxis: {
    labels: {
      style: {},
      formatter: (value: number) => `LKR ${value.toLocaleString()}`
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => `LKR ${value.toLocaleString()}`
    }
  }
};

// ==============================|| CHART - REVENUE/PROFIT LINE ||============================== //

export default function RevenueLine() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [view, setView] = useState<string>('revenue');
  const [options, setOptions] = useState<ChartProps>(areaChartOptions);

  // Sample data - replace with your actual data
  const revenueData = [45000, 52000, 48000, 61000, 58000, 65000, 72000, 68000, 75000, 82000, 78000, 85000];
  const profitData = [12000, 15000, 14000, 18000, 17000, 20000, 23000, 21000, 24000, 27000, 25000, 29000];

  const handleView = (event: MouseEvent<HTMLElement>, newView: string | null) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main],
      xaxis: {
        ...prevState.xaxis,
        labels: {
          style: {
            colors: Array(12).fill(secondary)
          }
        },
        axisBorder: {
          show: true,
          color: line
        }
      },
      yaxis: {
        ...prevState.yaxis,
        labels: {
          ...prevState.yaxis.labels,
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme]);

  const [series] = useState([
    {
      name: 'Revenue',
      data: revenueData
    }
  ]);

  const [profitSeries] = useState([
    {
      name: 'Profit',
      data: profitData
    }
  ]);

  return (
    <MainCard>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">{view === 'revenue' ? 'Revenue' : 'Profit'} Overview</Typography>
        <ToggleButtonGroup value={view} exclusive onChange={handleView} aria-label="revenue profit toggle" size="small">
          <ToggleButton value="revenue" aria-label="revenue">
            Revenue
          </ToggleButton>
          <ToggleButton value="profit" aria-label="profit">
            Profit
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <ReactApexChart
        options={options}
        series={view === 'revenue' ? series : profitSeries}
        type="line"
        height={450}
      />
    </MainCard>
  );
}
