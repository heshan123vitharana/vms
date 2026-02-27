// project-imports
import dashboard from './dashboard';
import views from './views';
import actions from './actions';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, views, actions]
};

export default menuItems;
