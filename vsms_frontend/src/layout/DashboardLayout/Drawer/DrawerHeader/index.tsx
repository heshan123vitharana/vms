// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// project-imports
import DrawerHeaderStyled from './DrawerHeaderStyled';

import { DRAWER_WIDTH, HEADER_HEIGHT, MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';

interface Props {
  open: boolean;
}

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }: Props) {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const theme = useTheme();

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <DrawerHeaderStyled
      open={open}
      sx={{
        minHeight: isHorizontal ? 'unset' : HEADER_HEIGHT,
        width: isHorizontal ? { xs: '100%', lg: DRAWER_WIDTH + 50 } : 'initial',
        paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 700,
          fontSize: '1.75rem',
          display: open ? 'block' : 'none'
        }}
      >
        MOTO ERP
      </Typography>
    </DrawerHeaderStyled>
  );
}
