import { Car, CarCategory, FuelType, Transmission, AddOn, User } from './types';

export const FALLBACK_CAR_IMAGE = '/assets/car-placeholder.svg';

export const MOCK_CARS: Car[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: CarCategory.Luxury,
    pricePerDay: 189,
    deposit: 500,
    transmission: Transmission.Automatic,
    fuelType: FuelType.Electric,
    seats: 5,
    mpg: '396 mi range',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
    features: ['Autopilot', '0-60 in 1.99s', 'Yoke Steering', 'Premium Audio'],
    isAvailable: true,
    rating: 4.9,
    tripCount: 42
  },
  {
    id: '2',
    make: 'Porsche',
    model: '911 Carrera',
    year: 2023,
    category: CarCategory.Sports,
    pricePerDay: 249,
    deposit: 1000,
    transmission: Transmission.Automatic,
    fuelType: FuelType.Petrol,
    seats: 4,
    mpg: '18/24 mpg',
    imageUrl: '/cars/porsche-911-carrera.png',
    features: ['Sport Chrono', 'Convertible', 'Bose Sound', 'Launch Control'],
    isAvailable: true,
    rating: 5.0,
    tripCount: 15
  },
  {
    id: '3',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2023,
    category: CarCategory.SUV,
    pricePerDay: 65,
    deposit: 200,
    transmission: Transmission.Automatic,
    fuelType: FuelType.Hybrid,
    seats: 5,
    mpg: '41/38 mpg',
    imageUrl: '/cars/toyota-rav4-hybrid.png',
    features: ['AWD', 'Apple CarPlay', 'Lane Keep Assist', 'Spacious Trunk'],
    isAvailable: true,
    rating: 4.7,
    tripCount: 128
  },
  {
    id: '4',
    make: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2022,
    category: CarCategory.Luxury,
    pricePerDay: 299,
    deposit: 1500,
    transmission: Transmission.Automatic,
    fuelType: FuelType.Petrol,
    seats: 5,
    mpg: '13/17 mpg',
    imageUrl: '/cars/mercedes-g-class.png',
    features: ['Massage Seats', 'Off-road capability', 'Burmester Audio', 'Sunroof'],
    isAvailable: false,
    rating: 4.8,
    tripCount: 64
  },
  {
    id: '5',
    make: 'Honda',
    model: 'Odyssey',
    year: 2023,
    category: CarCategory.Van,
    pricePerDay: 75,
    deposit: 250,
    transmission: Transmission.Automatic,
    fuelType: FuelType.Petrol,
    seats: 8,
    mpg: '19/28 mpg',
    imageUrl: '/cars/honda-odyssey.png',
    features: ['Magic Slide Seats', 'Rear Entertainment', 'Vacuum', 'Honda Sensing'],
    isAvailable: true,
    rating: 4.6,
    tripCount: 89
  },
  {
    id: '6',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2024,
    category: CarCategory.Sports,
    pricePerDay: 199,
    deposit: 800,
    transmission: Transmission.Automatic,
    fuelType: FuelType.Petrol,
    seats: 4,
    mpg: '16/23 mpg',
    imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1000',
    features: ['Carbon Fiber Trim', 'Drift Analyzer', 'Head-up Display', 'Laser Lights'],
    isAvailable: true,
    rating: 4.9,
    tripCount: 31
  }
];

export const ADD_ONS: AddOn[] = [
  { id: '1', name: 'Full Insurance Coverage', price: 25, description: 'Zero deductible for any damage.' },
  { id: '2', name: 'Prepaid Fuel', price: 60, description: 'Return the car at any fuel level.' },
  { id: '3', name: 'Child Safety Seat', price: 15, description: 'Safety first for your little ones.' },
  { id: '4', name: 'Unlimited Mileage', price: 40, description: 'Drive as far as you want without limits.' }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Driver',
  email: 'alex@example.com',
  role: 'customer',
  avatarUrl: '/cars/javaquez_copeland.jpg'
};

export const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'Admin User',
  email: 'admin@velocita.com',
  role: 'admin',
  avatarUrl: '/cars/javaquez_copeland.jpg'
};
