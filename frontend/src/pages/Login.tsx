import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
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

  useEffect(() => {
    const existingToken = localStorage.getItem(tokenKey);
    if (!existingToken) return;

    const existingUser = decodeJwt(existingToken);
    if (existingUser) {
      setAuth({ token: existingToken, user: existingUser });
      navigate(existingUser.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate, setAuth, tokenKey]);

  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-950 rounded-xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <Car className="h-12 w-12 text-amber-400 mx-auto" />
          <h1 className="text-3xl font-bold text-white mt-4">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to Exotic Rentals</p>
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
