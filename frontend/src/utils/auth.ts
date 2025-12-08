export interface AuthUser {
  id: string;
  role: 'admin' | 'customer';
  email: string;
  name: string;
  avatarUrl?: string | null;
}

export const decodeAuthToken = (token: string): AuthUser | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    const role = payload.role === 'admin' ? 'admin' : 'customer';
    const id = payload.id || payload._id;

    if (!payload.email || !id) {
      return null;
    }

    return {
      id: id.toString(),
      email: payload.email,
      name: payload.name || payload.email,
      role,
      avatarUrl: payload.avatarUrl ?? null,
    };
  } catch (error) {
    console.error('Failed to decode auth token', error);
    return null;
  }
};
