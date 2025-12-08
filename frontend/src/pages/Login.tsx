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
          className="relative w-full flex items-center justify-center gap-3 py-3 rounded-lg overflow-hidden border border-transparent shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] focus:ring-offset-gray-950"
          style={{
            background:
              'linear-gradient(#0f172a, #0f172a) padding-box, linear-gradient(90deg, #4285F4 0%, #34A853 33%, #FBBC05 66%, #EA4335 100%) border-box',
          }}
        >
          <div
            className="absolute inset-0 opacity-90 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #4285F4 0%, #34A853 33%, #FBBC05 66%, #EA4335 100%)' }}
          />
          <div className="relative flex items-center gap-3 w-full px-4 py-[10px] bg-white/95 text-gray-900 rounded-md font-semibold shadow-inner">
            <img src="/google-logo.svg" alt="Google" className="h-6 w-6" />
            <span className="flex-1 text-center">Sign in with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
};
