const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

const getToken = () => localStorage.getItem('auth_token');

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

export const authWithGoogle = async (payload: {
  idToken?: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  role?: 'admin' | 'customer';
}) => request('/auth/google', { method: 'POST', body: JSON.stringify(payload) });

export const fetchCurrentUser = () => request('/auth/me');
export const fetchVehicles = () => request('/vehicles');
export const fetchVehicle = (id: string) => request(`/vehicles/${id}`);
export const fetchSchedules = () => request('/schedules');
export const fetchCustomers = () => request('/customers');
export const fetchAdminDashboard = () => request('/admin/dashboard');
export const fetchRentalHistory = () => request('/rental-history');

export const clearSession = () => localStorage.removeItem('auth_token');
export const storeSession = (token: string) => localStorage.setItem('auth_token', token);
export { API_BASE_URL };
