import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Shield } from 'lucide-react';
import { AuthContext } from '../App';
import { API_BASE_URL } from '../services/apiClient';

interface LoginProps {
  tokenKey: string;
}

export const Login: React.FC<LoginProps> = ({ tokenKey }) => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.user?.role === 'admin') {
      navigate('/admin');
    } else if (auth.user?.role === 'customer') {
      navigate('/dashboard');
    }
  }, [auth.user, navigate]);

  const handleGoogleSignIn = () => {
    localStorage.removeItem(tokenKey);
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
          className="group relative w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#4C8BF5] via-[#4BA2F8] to-[#49B1FA] px-5 py-4 shadow-lg transition duration-150 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4C8BF5] focus:ring-offset-gray-950"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 via-white/10 to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="relative flex items-center gap-3 text-white font-semibold tracking-wide">
            <span className="grid place-items-center h-10 w-10 rounded-full bg-white/95">
              <img src="/google-logo.svg" alt="Google" className="h-6 w-6" />
            </span>
            <span>Sign in with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
};
