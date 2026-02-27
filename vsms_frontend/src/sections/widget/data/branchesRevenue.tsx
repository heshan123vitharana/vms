'use client';

// material-ui
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// assets
import { Profile } from '@wandersonalwes/iconsax-react';

// Sample dealer data - replace with your actual data
const dealersData = [
  { id: 1, name: 'AutoMax branche', revenue: 125840, color: 'primary' },
  { id: 2, name: 'Elite Motors', revenue: 98250, color: 'success' },
  { id: 3, name: 'Premium Cars LLC', revenue: 87630, color: 'warning' },
  { id: 4, name: 'City Auto Sales', revenue: 76420, color: 'error' },
  { id: 5, name: 'Grand Motors', revenue: 65180, color: 'info' },
  { id: 6, name: 'Luxury Vehicles', revenue: 54320, color: 'secondary' },
  { id: 7, name: 'Metro Auto Group', revenue: 48750, color: 'primary' },
  { id: 8, name: 'First Choice Cars', revenue: 42100, color: 'success' }
];

// ===========================|| DATA WIDGET - DEALERS REVENUE ||=========================== //

export default function BranchesRevenue() {
  return (
    <MainCard title="Top branches Revenue" content={false}>
      <SimpleBar sx={{ height: 490 }}>
        <List
          disablePadding
          component="nav"
          aria-label="branches revenue list"
          sx={{
            '& .MuiListItemButton-root': { borderRadius: 0, my: 0, py: 1.5 },
            '& .MuiListItemText-root': { color: 'text.primary' }
          }}
        >
          {dealersData.map((dealer, index) => (
            <div key={dealer.id}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar variant="rounded" color={dealer.color as any}>
                    <Profile variant="Bold" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">{dealer.name}</Typography>
                      <Typography variant="subtitle1" sx={{ color: 'success.main', fontWeight: 600 }}>
                        ${dealer.revenue.toLocaleString()}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Sales: {(8-dealer.id) * 25} vehicles
                    </Typography>
                  }
                />
              </ListItemButton>
              {index < dealersData.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </SimpleBar>
    </MainCard>
  );
}
