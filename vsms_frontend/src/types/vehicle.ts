// ==============================|| TYPES - VEHICLE  ||============================== //

export type VehicleStatus = 'Available' | 'Sold' | 'Transferred' | 'Reserved';
export type RegistrationType = 'Registered' | 'Unregistered';
export type TransmissionType = 'Automatic' | 'Manual' | 'CVT' | 'Semi-Automatic';
export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';
export type VehicleType = 'Car' | 'SUV' | 'Van' | 'Bus' | 'Lorry' | 'Truck' | 'Pickup' | 'Minivan' | 'Coupe' | 'Sedan' | 'Hatchback' | 'Wagon';

export interface VehicleImages {
  frontView?: string;
  rearView?: string;
  leftSideView?: string;
  rightSideView?: string;
  interior?: string;
  engine?: string;
  dashboard?: string;
  others?: string[];
}

export interface RegisteredVehicleDetails {
  registrationNumber: string;
  numberPlate: string;
  registrationDate: string;
  numberOfPreviousOwners: number;
}

export interface UnregisteredVehicleDetails {
  chassisNumber: string;
  engineNumber: string;
  importYear: number;
  auctionGrade?: string;
}

export interface Vehicle {
  id: number;
  stockNumber: string;
  make: string;
  model: string;
  subModel?: string;
  vehicleType: VehicleType;
  year: number;
  color: string;
  countryOfOrigin: string;
  fuelType: FuelType;
  mileage: number;
  transmissionType: TransmissionType;
  engineSize?: string;
  
  // Registration
  registrationType: RegistrationType;
  registeredDetails?: RegisteredVehicleDetails;
  unregisteredDetails?: UnregisteredVehicleDetails;
  
  // VIN
  vin?: string;
  
  // Pricing
  price: number;
  
  // Assignment
  dealer: string;
  dealerId?: number;
  tenant?: string;
  tenantId?: number;
  status: VehicleStatus;
  
  // Additional
  description?: string;
  images?: VehicleImages;
}
