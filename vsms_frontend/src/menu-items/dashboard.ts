// assets
import { Home3, ChartSquare } from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: Home3,
  adminDashboard: ChartSquare
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: NavItemType = {
  id: 'group-dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'admin-dashboard',
      title: 'Admin Dashboard',
      type: 'item',
      url: '/admin-dashboard',
      icon: icons.adminDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
