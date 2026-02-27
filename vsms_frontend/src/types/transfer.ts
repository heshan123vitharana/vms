// ==============================|| TYPES - TRANSFER ||============================== //

export interface VehicleSearchResult {
  id: number;
  stock_number: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
  dealer_id: number | null;
  dealer_name: string | null;
}

export interface TransferVehicle {
  id: number;
  stockNumber: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  price: number;
}

export interface TransferDealer {
  id: number;
  name: string;
  address?: string;
  status?: string;
}

export interface Transfer {
  id: number;
  tenantId: number;
  vehicleId: number;
  fromDealerId: number | null;
  toDealerId: number | null;
  transferDate: string;
  transferPrice: number;
  transportCost: number;
  status: 'pending' | 'completed';
  responsiblePerson: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle?: TransferVehicle;
  fromDealer?: TransferDealer;
  toDealer?: TransferDealer;
}

export interface TransferFormData {
  vehicle_id: number;
  from_dealer_id: number | null;
  to_dealer_id: number;
  transfer_date: string;
  transfer_price: number;
  transport_cost: number;
  status: 'pending' | 'completed';
  responsible_person: string;
}
