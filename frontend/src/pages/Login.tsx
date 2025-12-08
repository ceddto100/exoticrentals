import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthUser } from '../App';
import { API_BASE_URL } from '../services/apiClient';
import { LogoBadge } from '../components/LogoBadge';

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
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-black overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(248, 113, 113, 0.18), transparent 35%), radial-gradient(circle at 80% 30%, rgba(239, 68, 68, 0.2), transparent 40%), radial-gradient(circle at 50% 80%, rgba(127, 29, 29, 0.22), transparent 35%)',
        }}
      />
      <div className="relative w-full max-w-md bg-black/80 rounded-xl shadow-2xl p-8 border border-red-900/60 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="mx-auto">
            <LogoBadge size="large" />
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]">Welcome Back</h1>
          <p className="text-gray-300">Sign in to continue to Exotic Rentals</p>
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-gradient-to-r from-black via-red-900 to-red-600 text-white font-semibold shadow-[0_0_20px_rgba(248,113,113,0.35)] hover:shadow-[0_0_28px_rgba(248,113,113,0.5)] transition-all"
        >
          <span className="tracking-wide">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};
