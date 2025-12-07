import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'customer') => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    window.open('https://accounts.google.com/signin', '_blank', 'noopener,noreferrer');
  };

  const handleSimulatedLogin = (role: 'admin' | 'customer') => {
    onLogin(role);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Car className="h-12 w-12 text-amber-300" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Sign in to Exotic Rentals</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or <a href="#" className="font-medium text-amber-300 hover:text-amber-200">start your 14-day free trial</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900/90 border border-gray-800 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="space-y-8">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex gap-4 items-center">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-inner">
                <span className="text-xl font-black text-blue-500">G</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">Sign in with Google</p>
                <p className="text-sm text-gray-400">Use your Google account to continue, or create one in seconds.</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-white/30 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 focus:ring-offset-gray-900"
              >
                <span className="text-lg">🔒</span>
                Continue with Google
              </button>
              <a
                href="https://accounts.google.com/signup"
                target="_blank"
                rel="noreferrer"
                className="block text-center text-xs font-medium text-amber-300 hover:text-amber-200"
              >
                Create a Google account
              </a>
              <button
                onClick={() => handleSimulatedLogin('customer')}
                className="w-full flex justify-center py-2 px-4 border border-amber-400/60 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-amber-300 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 focus:ring-offset-gray-900"
              >
                Sign in as Customer
              </button>
              <button
                onClick={() => handleSimulatedLogin('admin')}
                className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-100 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 focus:ring-offset-gray-900"
              >
                Sign in as Admin
              </button>
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Demo Mode: No password required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};