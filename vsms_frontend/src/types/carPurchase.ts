// ==============================|| TYPES - CAR PURCHASE ||============================== //

export interface CarPurchaseSeller {
  id: number;
  name: string;
  nicOrReg?: string;
  address: string;
  phone: string;
  email?: string;
  sellerType: 'individual' | 'dealer' | 'auction';
}

export interface CarPurchaseVehicle {
  id: number;
  stockNumber: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  price: number;
}

export interface CarPurchasePaymentMethod {
  id: number;
  name: string;
}

export interface CarPurchase {
  id: number;
  vehicleId: number;
  purchaseDate: string;
  purchasePrice: number;
  paymentMethodId: number;
  invoiceNumber: string;
  taxAmount: number;
  branch?: string;
  documentPath?: string;
  taxDetails?: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: CarPurchaseVehicle;
  paymentMethod?: CarPurchasePaymentMethod;
  sellers: CarPurchaseSeller[];
}

export interface CarPurchaseFormData {
  // General Details
  vehicle_id: number;
  purchase_date: string;
  branch: string;
  purchase_price: number;
  payment_method_id: number;
  invoice_number: string;
  tax_details: string;
  document?: File;
  
  // Seller Details
  seller_name: string;
  seller_address: string;
  seller_phone: string;
  seller_email?: string;
  seller_nic?: string;
  seller_type?: 'individual' | 'dealer' | 'auction';
}

export interface Branch {
  id: number;
  name: string;
  address?: string;
}

export interface VehicleSearchResult {
  id: number;
  stock_number: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
}
