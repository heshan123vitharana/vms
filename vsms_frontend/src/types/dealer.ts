// ==============================|| TYPES - DEALER  ||============================== //

export type DealerStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended';

export interface Dealer {
  id: number;
  dealerCode: string;
  name: string;
  email: string;
  phone: string;
  totalVehicles: number;
  available: number;
  sold: number;
  revenue: number;
  status: DealerStatus;
}
