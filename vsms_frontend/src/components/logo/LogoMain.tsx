// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain({ reverse }: { reverse?: boolean }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        variant="h3"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 700,
          fontSize: '1.75rem',
          letterSpacing: '0.5px'
        }}
      >
        MOTO ERP
      </Typography>
    </Box>
  );
}
