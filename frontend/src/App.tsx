import React, { useState, createContext, useContext, useEffect } from 'react';
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

interface Auth {
  token: string | null;
  user: { id: string; role: string } | null;
}

export const AuthContext = createContext<{ auth: Auth; setAuth: React.Dispatch<React.SetStateAction<Auth>> }>({
  auth: { token: null, user: null },
  setAuth: () => {},
});

const App: React.FC = () => {
  const [auth, setAuth] = useState<Auth>({ token: null, user: null });

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      // You should decode and verify the token here, but for simplicity, we'll just set it
      setAuth({ token, user: { id: '', role: 'customer' } }); // You should get the user from the token
    }
  }, []);

  const onLogin = (role: 'admin' | 'customer') => {
    // This function is now primarily for simulated logins, but can be adapted
    const token = 'simulated-token'; // In a real scenario, you'd get this from the backend
    setAuth({ token, user: { id: 'simulated-user', role } });
    localStorage.setItem('jwt', token);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route
              path="/admin"
              element={auth.user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={auth.user ? <UserDashboard /> : <Navigate to="/login" />}
            />
          </Routes>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
