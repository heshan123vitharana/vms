import { useRef, useState } from 'react';

// next
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';

import useUser from 'hooks/useUser';

// assets
const avatar1 = '/assets/images/users/avatar-6.png';
import { Logout } from '@wandersonalwes/iconsax-react';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function ProfilePage() {
  const router = useRouter();
  const user = useUser();

  const { data: session } = useSession();
  const provider = session?.provider;
  const userRole = session?.user?.role || '';

  const handleLogout = () => {
    switch (provider) {
      case 'auth0':
        signOut({ callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/logout/auth0` });
        break;
      case 'cognito':
        signOut({ callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/logout/cognito` });
        break;
      default:
        signOut({ redirect: false });
    }

    router.push('/');
  };

  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={(theme) => ({
          p: 0.25,
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter', ...theme.applyStyles('dark', { bgcolor: 'secondary.light' }) },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2
          }
        })}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Avatar alt="profile user" src={avatar1} />
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper
              sx={(theme) => ({
                boxShadow: theme.customShadows.z1,
                width: 240,
                minWidth: 200,
                maxWidth: 240,
                borderRadius: 1.5
              })}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                    <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center' }}>
                      <Avatar alt="profile user" src={avatar1} />
                      <Stack>
                        <Typography variant="subtitle1">{user ? user?.name : ''}</Typography>
                        <Typography variant="body2" color="secondary" sx={{ textTransform: 'capitalize' }}>
                          {userRole}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                  <Divider />
                  <List component="nav" sx={{ p: 1, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout variant="Bulk" size={18} />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
