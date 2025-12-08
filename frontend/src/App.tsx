
import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { HowItWorks } from './pages/HowItWorks';
import { VehicleDetails } from './pages/VehicleDetails';
import { Checkout } from './pages/Checkout';
import { AuthSuccess } from './pages/AuthSuccess';

// Define a structured user object. This improves type safety.
export interface AuthUser {
  id: string;
  role: 'admin' | 'customer';
  email: string;
  name: string;
  avatarUrl?: string; // Avatar is optional
}

// Define the shape of the authentication context.
interface Auth {
  token: string | null;
  user: AuthUser | null; // Use the structured user type
}

// Create the context with a safe, null-based initial value.
export const AuthContext = createContext<{
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}>({ auth: { token: null, user: null }, setAuth: () => {} });

// Helper to decode JWT. In a real app, use a library like jwt-decode.
const decodeJwt = (token: string): AuthUser | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as AuthUser;
  } catch (e) {
    return null;
  }
};

// Custom hook to simplify role-based route protection.
const ProtectedRoute: React.FC<{ role: 'admin' | 'customer'; children: React.ReactElement }> = ({ role, children }) => {
  const { auth } = React.useContext(AuthContext);
  
  if (!auth.token || !auth.user) {
    // If not authenticated, redirect to login.
    return <Navigate to="/login" />;
  }
  
  if (auth.user.role !== role) {
    // If authenticated but wrong role, redirect to a safe page (e.g., their own dashboard).
    return <Navigate to={auth.user.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return children;
};

const App: React.FC = () => {
  // Initialize state with a check for a token in local storage.
  const [auth, setAuth] = useState<Auth>(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const user = decodeJwt(token);
      if (user) {
        return { token, user };
      }
    }
    return { token: null, user: null };
  });

  // This effect synchronizes the auth state across browser tabs.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'jwt') {
        const token = event.newValue;
        if (token) {
          const user = decodeJwt(token);
          if (user) {
            setAuth({ token, user });
          } else {
            setAuth({ token: null, user: null });
          }
        } else {
          setAuth({ token: null, user: null });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/success" element={<AuthSuccess />} />

            {/* Protected Routes */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute role="customer">
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute role="customer">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
