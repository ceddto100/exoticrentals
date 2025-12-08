import { Car } from '../types';

export const AUTH_TOKEN_KEY = 'auth_token';
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';
const API_PREFIX = '/api';

const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const request = async (path: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const normalizeVehicle = (vehicle: any): Car => {
  const images = Array.isArray(vehicle?.images) && vehicle.images.length > 0
    ? vehicle.images
    : vehicle?.imageUrl
      ? [vehicle.imageUrl]
      : [];

  return {
    ...vehicle,
    id: vehicle.id || vehicle._id,
    images,
    imageUrl: vehicle.imageUrl || images[0],
    description: vehicle.description || '',
    mileage: vehicle.mileage ?? 0,
    features: Array.isArray(vehicle.features) ? vehicle.features : [],
    isAvailable: typeof vehicle.isAvailable === 'boolean' ? vehicle.isAvailable : true,
    rating: vehicle.rating ?? 5,
    tripCount: vehicle.tripCount ?? 0,
  } as Car;
};

export interface VehiclePayload {
  make: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  description?: string;
  mileage?: number;
  deposit?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  mpg?: string;
  images: string[];
  features: string[];
  isAvailable: boolean;
}

export const authWithGoogle = async (payload: {
  idToken?: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  role?: 'admin' | 'customer';
}) => request('/auth/google', { method: 'POST', body: JSON.stringify(payload) });

export const fetchCurrentUser = () => request('/auth/me');

export const fetchVehicles = async (): Promise<Car[]> => {
  const vehicles = await request(`${API_PREFIX}/vehicles`);
  return vehicles.map(normalizeVehicle);
};

export const fetchVehicle = async (id: string): Promise<Car> => {
  const vehicle = await request(`${API_PREFIX}/vehicles/${id}`);
  return normalizeVehicle(vehicle);
};

export const updateVehicle = (id: string, payload: VehiclePayload) =>
  request(`${API_PREFIX}/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const createVehicle = (payload: VehiclePayload) =>
  request(`${API_PREFIX}/vehicles`, { method: 'POST', body: JSON.stringify(payload) });

export const deleteVehicle = (id: string) =>
  request(`${API_PREFIX}/vehicles/${id}`, { method: 'DELETE' });

export const fetchSchedules = () => request(`${API_PREFIX}/schedules`);
export const fetchCustomers = () => request(`${API_PREFIX}/customers`);
export const fetchAdminDashboard = () => request(`${API_PREFIX}/admin/dashboard`);
export const fetchRentalHistory = () => request(`${API_PREFIX}/rental-history`);

export const clearSession = () => localStorage.removeItem(AUTH_TOKEN_KEY);
export const storeSession = (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token);
export { API_BASE_URL };
