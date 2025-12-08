
import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, AuthUser } from '../App'; // Ensure AuthUser is exported from App

// Helper to decode JWT. In a real app, you might use a library like jwt-decode.
const decodeJwt = (token: string): AuthUser | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload) as AuthUser;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Get the token from the URL query parameters.
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 2. Decode the JWT to get user information.
      const decodedUser = decodeJwt(token);

      if (decodedUser && setAuth) {
        // 3. Store the token and user data in local storage and auth context.
        localStorage.setItem('jwt', token);
        setAuth({ token, user: decodedUser });

        // 4. Redirect based on user role.
        if (decodedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Handle cases where the token is invalid or decoding fails.
        setError('Invalid authentication token. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } else {
      // Handle cases where no token is provided.
      setError('Authentication failed. No token provided.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [location, navigate, setAuth]);

  // Render a user-friendly loading or error state.
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
