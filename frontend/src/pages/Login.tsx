import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthUser } from '../App';
import { API_BASE_URL } from '../services/apiClient';
import { Sparkles, Shield, Zap } from 'lucide-react';

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
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="glass-card rounded-3xl p-10 neon-border">
          {/* Logo and Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <img
                src="/exotic_rentals.png"
                alt="Exotic Rentals logo"
                className="h-16 w-auto mx-auto"
              />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-red-400 animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-3">
              Welcome <span className="gradient-text">Back</span>
            </h1>
            <p className="text-gray-400">Sign in to access your account and continue your journey</p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl primary-gradient-btn text-white font-bold text-lg mb-6"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
            <span className="text-gray-500 text-sm">Secure Authentication</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Shield className="h-5 w-5 text-red-400 mx-auto mb-2" />
              <span className="text-xs text-gray-400">Secure</span>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Zap className="h-5 w-5 text-red-400 mx-auto mb-2" />
              <span className="text-xs text-gray-400">Fast</span>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Sparkles className="h-5 w-5 text-red-400 mx-auto mb-2" />
              <span className="text-xs text-gray-400">AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
