// assets
import { TableDocument, Car, DollarCircle, Profile2User } from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  tables: TableDocument,
  vehicles: Car,
  sales: DollarCircle,
  transfer: Profile2User
};

// ==============================|| MENU ITEMS - VIEWS ||============================== //

const views: NavItemType = {
  id: 'group-views',
  title: 'Views',
  type: 'group',
  children: [
    {
      id: 'find-vehicle',
      title: 'Find Vehicle',
      type: 'item',
      url: '/find-vehicle',
      icon: icons.vehicles
    },
    {
      id: 'vehicle-table',
      title: 'Vehicle Table',
      type: 'item',
      url: '/tables/vehicles',
      icon: icons.vehicles
    },
    {
      id: 'sales-table',
      title: 'Sales Table',
      type: 'item',
      url: '/tables/sales',
      icon: icons.sales
    },
    {
      id: 'transfer-table',
      title: 'Transfer Table',
      type: 'item',
      url: '/tables/transfer',
      icon: icons.sales
    }
  ]
};

export default views;
