export enum Transmission {
  Automatic = 'Automatic',
  Manual = 'Manual'
}

export enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid'
}

export enum CarCategory {
  Sedan = 'Sedan',
  SUV = 'SUV',
  Luxury = 'Luxury',
  Sports = 'Sports',
  Van = 'Van'
}

export interface Car {
  id: string;
  _id?: string;
  make: string;
  model: string;
  year: number;
  category: CarCategory | string;
  pricePerDay: number;
  dailyRate?: number;
  deposit?: number;
  transmission?: Transmission | string;
  fuelType?: FuelType | string;
  seats?: number;
  mpg?: string; // or range for EV
  imageUrl?: string;
  images: string[];
  description?: string;
  mileage?: number;
  features: string[];
  isAvailable: boolean;
  status?: string;
  rating?: number;
  tripCount?: number;
}

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  pickupDate: string;
  returnDate: string;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  addOns: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatarUrl?: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}