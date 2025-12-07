import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { VehicleDetails } from './pages/VehicleDetails';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDashboard } from './pages/UserDashboard';
import { Login } from './pages/Login';
import { HowItWorks } from './pages/HowItWorks';
import { User } from './types';
import { authWithGoogle, clearSession, fetchCurrentUser, storeSession } from './services/apiClient';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const response = await fetchCurrentUser();
        setUser(response.user);
      } catch (error) {
        clearSession();
        console.warn('Unable to restore session', error);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, []);

  const handleLogin = async (role: 'admin' | 'customer') => {
    try {
      const response = await authWithGoogle({
        idToken: '', // Frontend obtains Google token; demo mode relies on ALLOW_DEMO_AUTH
        email: role === 'admin' ? 'admin@exoticrentals.demo' : 'guest@exoticrentals.demo',
        name: role === 'admin' ? 'Admin Manager' : 'Guest Driver',
        role,
      });
      storeSession(response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Authentication failed', error);
      throw error;
    }
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/vehicle/:id" element={<VehicleDetails user={user} />} />
          <Route
            path="/checkout"
            element={user ? <Checkout user={user} /> : loading ? <></> : <Navigate to="/login" replace />} />
          <Route
            path="/admin"
            element={
              user?.role === 'admin' ? <AdminDashboard /> : loading ? <></> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={user ? <UserDashboard user={user} /> : loading ? <></> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Layout>
    </Router>
  );
}