import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { decodeAuthToken } from '../utils/auth';

interface AuthSuccessProps {
  tokenKey: string;
}

export const AuthSuccess: React.FC<AuthSuccessProps> = ({ tokenKey }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      const decodedUser = decodeAuthToken(token);

      if (decodedUser) {
        localStorage.setItem(tokenKey, token);
        setAuth({ token, user: decodedUser });

        if (decodedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid authentication token. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } else {
      setError('Authentication failed. No token provided.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [location, navigate, setAuth, tokenKey]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      {error ? (
        <>
          <p className="text-red-500">{error}</p>
          <p>Redirecting to login...</p>
        </>
      ) : (
        <p>Authenticating... Please wait.</p>
      )}
    </div>
  );
};
