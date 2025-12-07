import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'customer') => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

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
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-950 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm text-gray-100" placeholder="demo@exoticrentals.com" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" autoComplete="current-password" className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-950 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm text-gray-100" placeholder="••••••••" />
              </div>
            </div>

            <div className="space-y-3">
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