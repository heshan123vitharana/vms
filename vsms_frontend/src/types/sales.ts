// ==============================|| TYPES - SALES ||============================== //

export interface SaleVehicle {
  id: number;
  stockNumber: string;
  make: string;
  model: string;
  subModel?: string;
  year: number;
  color: string;
  fuelType: string;
  transmissionType: string;
  mileage: number;
  price: number;
  status: string;
}

export interface SalePaymentMethod {
  id: number;
  name: string;
}

export interface SaleSeller {
  id?: number;
  name: string;
  nicOrReg?: string;
  address?: string;
  phone?: string;
  email?: string;
  sellerType?: string;
}

export interface SaleBuyer {
  id: number;
  name: string;
  nicOrReg: string;
  address: string;
  phone: string;
  email?: string;
}

export interface Sale {
  id: number;
  vehicleId: number;
  saleDate: string;
  salePrice: number;
  discount: number;
  finalAmount: number;
  paymentMethodId: number;
  invoiceNumber: string;
  commission: number;
  salespersonName: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: SaleVehicle;
  paymentMethod?: SalePaymentMethod;
  seller?: SaleSeller;
  buyer?: SaleBuyer;
}

export interface SalesStatistics {
  totalSales: number;
  totalRevenue: number;
  totalDiscount: number;
  totalCommission: number;
}
