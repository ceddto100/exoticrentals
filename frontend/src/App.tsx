import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminVehicleEdit } from './pages/AdminVehicleEdit';
import { AdminVehicleAdd } from './pages/AdminVehicleAdd';
import { UserDashboard } from './pages/UserDashboard';
import { HowItWorks } from './pages/HowItWorks';
import { VehicleDetails } from './pages/VehicleDetails';
import { Checkout } from './pages/Checkout';
import { AuthSuccess } from './pages/AuthSuccess';
import { AUTH_TOKEN_KEY } from './services/apiClient';

// ScrollToTop component - scrolls to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export interface AuthUser {
  id: string;
  role: 'admin' | 'customer';
  email: string;
  name: string;
  avatarUrl?: string | null;
}

interface Auth {
  token: string | null;
  user: AuthUser | null;
}

export const AuthContext = createContext<{
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}>({ auth: { token: null, user: null }, setAuth: () => {} });

const decodeJwt = (token: string): AuthUser | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as AuthUser;
  } catch (e) {
    return null;
  }
};

const ProtectedRoute: React.FC<{ role: 'admin' | 'customer'; children: React.ReactElement }> = ({ role, children }) => {
  const { auth } = React.useContext(AuthContext);

  if (!auth.token || !auth.user) {
    return <Navigate to="/login" />;
  }

  if (auth.user.role !== role) {
    return <Navigate to={auth.user.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return children;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<Auth>(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      const user = decodeJwt(token);
      if (user) {
        return { token, user };
      }
    }
    return { token: null, user: null };
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_TOKEN_KEY) {
        const token = event.newValue;
        if (token) {
          const user = decodeJwt(token);
          setAuth(user ? { token, user } : { token: null, user: null });
        } else {
          setAuth({ token: null, user: null });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, auth.token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [auth]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <ScrollToTop />
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/login" element={<Login tokenKey={AUTH_TOKEN_KEY} />} />
            <Route path="/auth/success" element={<AuthSuccess tokenKey={AUTH_TOKEN_KEY} />} />

            <Route
              path="/checkout/:vehicleId"
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
                  <Navigate to="/admin/fleet" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/fleet"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles/:id/edit"
              element={
                <ProtectedRoute role="admin">
                  <AdminVehicleEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles/add"
              element={
                <ProtectedRoute role="admin">
                  <AdminVehicleAdd />
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

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
