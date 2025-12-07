import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'customer') => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    window.open('https://accounts.google.com/AccountChooser?service=mail', '_blank', 'noopener,noreferrer');
  };

  const handleSimulatedLogin = (role: 'admin' | 'customer') => {
    onLogin(role);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  const handleAdminSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSimulatedLogin('admin');
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

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/90 border border-gray-800 py-8 px-6 shadow-xl rounded-lg">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex gap-4 items-center">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-inner">
              <span className="text-2xl font-black text-red-500">M</span>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white">Continue with Gmail</p>
              <p className="text-sm text-gray-400">Choose your Google account or create a new Gmail to continue.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/30 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 focus:ring-offset-gray-900"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.32 0 5.6 1.44 6.88 2.64l5.02-4.9C32.78 3.84 28.78 2 24 2 14.62 2 6.67 7.98 3.6 16.26l5.86 4.56C11.16 14.32 17.1 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.18-.44-4.69H24v9.12h12.7c-.53 2.68-2.09 4.95-4.46 6.48l6.99 5.45C43.97 36.58 46.5 31 46.5 24.5z" />
                <path fill="#FBBC05" d="M10.46 28.7c-.48-1.44-.76-2.97-.76-4.7s.28-3.26.76-4.7l-5.86-4.56C2.82 17.92 2 21.34 2 24s.82 6.08 2.6 9.26l5.86-4.56z" />
                <path fill="#34A853" d="M24 46c6.5 0 11.94-2.14 15.92-5.83l-6.99-5.45c-1.94 1.3-4.43 2.28-8.93 2.28-6.9 0-12.84-4.82-14.54-11.32l-5.86 4.56C6.67 40.02 14.62 46 24 46z" />
                <path fill="none" d="M2 2h44v44H2z" />
              </svg>
              Continue with Google
            </button>
            <a
              href="https://accounts.google.com/signup"
              target="_blank"
              rel="noreferrer"
              className="block text-center text-xs font-medium text-amber-300 hover:text-amber-200"
            >
              Create a Google account instead
            </a>
            <div className="mt-4 bg-gray-950/80 border border-gray-800 rounded-md p-3 text-xs text-gray-400">
              You&apos;ll be taken to Google&apos;s account chooser to pick an existing Gmail or start signup.
            </div>
          </div>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 py-8 px-6 shadow-xl rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-amber-300/20 border border-amber-300/50 flex items-center justify-center text-amber-200 font-semibold">
              Admin
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Admin email sign in</p>
              <p className="text-sm text-gray-400">Use your admin credentials to continue to the dashboard.</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleAdminSubmit}>
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-200">
                Work email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md bg-gray-950 border border-gray-800 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md bg-gray-950 border border-gray-800 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-amber-400/60 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-amber-300 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-300 focus:ring-offset-gray-900"
            >
              Sign in to Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};