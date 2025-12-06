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
import { MOCK_USER } from './constants';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  // Simple auth state simulation
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: 'admin' | 'customer') => {
    // Simulating login
    if (role === 'admin') {
      setUser({ ...MOCK_USER, role: 'admin', name: 'Admin Manager' });
    } else {
      setUser(MOCK_USER);
    }
  };

  const handleLogout = () => {
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
          <Route path="/checkout" element={user ? <Checkout user={user} /> : <Navigate to="/login" replace />} />
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <UserDashboard user={user} /> : <Navigate to="/login" replace />} 
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Layout>
    </Router>
  );
}