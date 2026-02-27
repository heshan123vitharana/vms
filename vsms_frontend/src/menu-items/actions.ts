// assets
import { Add, ShoppingCart, Driving } from '@wandersonalwes/iconsax-react';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
  add: Add,
  buy: ShoppingCart,
  transfer: Driving
};

// ==============================|| MENU ITEMS - ACTIONS ||============================== //

const actions: NavItemType = {
  id: 'group-actions',
  title: 'Actions',
  type: 'group',
  children: [
    {
      id: 'add-new-car',
      title: 'Add New Vehicle',
      type: 'item',
      url: '/tables/vehicles/vehicleRegisterForm',
      icon: icons.add
    },
    {
      id: 'sell-car',
      title: 'Sell A Vehicle',
      type: 'item',
      url: '/actions/sell-car',
      icon: icons.buy
    },
    {
      id: 'Transfer',
      title: 'Transfer A Vehicle',
      type: 'item',
      url: '/actions/transfer-car',
      icon: icons.buy
    }
  ]
};

export default actions;
