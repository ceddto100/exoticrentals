import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Shield, Mail, Key } from 'lucide-react';
import { AuthContext, AuthUser } from '../App';
import { API_BASE_URL } from '../services/apiClient';

interface LoginProps {
  tokenKey: string;
}

const decodeJwt = (token: string): AuthUser | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as AuthUser;
  } catch (e) {
    return null;
  }
};

export const Login: React.FC<LoginProps> = ({ tokenKey }) => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleAdminSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token } = data;
      const user = decodeJwt(token);

      if (token && user) {
        localStorage.setItem(tokenKey, token);
        setAuth({ token, user });
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        throw new Error('Invalid token received');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-950 rounded-xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <Car className="h-12 w-12 text-amber-400 mx-auto" />
          <h1 className="text-3xl font-bold text-white mt-4">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to Exotic Rentals</p>
        </div>

        <form onSubmit={handleAdminSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 bg-amber-400 text-gray-900 font-semibold py-3 rounded-lg hover:bg-amber-300 transition-all duration-300 disabled:opacity-60"
          >
            <Shield className="h-5 w-5" />
            {isSubmitting ? 'Signing In...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-950 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <img src="/google-logo.svg" alt="Google" className="h-6 w-6" />
          <span className="text-white font-medium">Sign In with Google</span>
        </button>
      </div>
    </div>
  );
};
