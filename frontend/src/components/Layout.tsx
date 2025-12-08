import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Shield, Phone, Mail, Bot } from 'lucide-react';
import { AIChatModal } from './AIChatModal';
import { AuthContext } from '../App';

interface LayoutProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

const FALLBACK_AVATAR = '/assets/car-placeholder.svg';

export const Layout: React.FC<LayoutProps> = ({ onLogout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const user = auth.user;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '150px 0px',
    });

    const observeNewElements = () => {
      const revealElements = document.querySelectorAll('.reveal-on-scroll:not(.visible)');
      revealElements.forEach((el) => {
        observer.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          (el as HTMLElement).classList.add('visible');
        }
      });
    };

    const mutationObserver = new MutationObserver(() => observeNewElements());
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    observeNewElements();

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

    return (
      <div className="relative min-h-screen bg-black text-gray-100 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 18% 18%, rgba(248, 113, 113, 0.25), transparent 34%), radial-gradient(circle at 82% 28%, rgba(239, 68, 68, 0.28), transparent 42%), radial-gradient(circle at 50% 82%, rgba(127, 29, 29, 0.28), transparent 38%)',
          }}
        />

        <div className="relative flex flex-col min-h-screen">
          <header className="bg-gradient-to-r from-black via-red-950/50 to-black backdrop-blur-md border-b border-red-900/70 sticky top-0 z-40 shadow-[0_10px_30px_rgba(248,113,113,0.22)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <img
                  src="/exotic_rentals.png"
                  alt="Exotic Rentals logo"
                  className="h-10 w-auto drop-shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                />
                <span className="ml-2 text-xl font-bold text-white tracking-tight">Exotic Rentals</span>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-200 hover:text-red-300 font-medium transition">Inventory</Link>
                <Link to="/how-it-works" className="text-gray-200 hover:text-red-300 font-medium transition">How it Works</Link>

                {user ? (
                  <div className="flex items-center space-x-4">
                    {user.role === 'admin' ? (
                      <Link to="/admin" className="text-red-300 font-medium hover:text-red-200">Admin Dashboard</Link>
                    ) : (
                      <Link to="/dashboard" className="text-red-300 font-medium hover:text-red-200">My Dashboard</Link>
                    )}
                    <div className="flex items-center space-x-2 text-gray-100">
                      <img src={user.avatarUrl || FALLBACK_AVATAR} alt="User" className="h-8 w-8 rounded-full border border-red-900/60 object-cover shadow-[0_0_12px_rgba(248,113,113,0.3)]" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-gray-200 hover:text-red-300 font-medium"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-gray-200 hover:text-red-300 font-medium">Log in</Link>
                  </div>
                )}
              </nav>

              <div className="flex items-center md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden bg-black/90 border-b border-red-900/60">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-red-300 hover:bg-red-950/30" onClick={() => setIsMobileMenuOpen(false)}>Inventory</Link>
                <Link to="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-red-300 hover:bg-red-950/30" onClick={() => setIsMobileMenuOpen(false)}>How it Works</Link>
                {user ? (
                  <>
                    {user.role === 'admin' ? (
                      <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-950/30" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                    ) : (
                      <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-red-300 hover:bg-red-950/30" onClick={() => setIsMobileMenuOpen(false)}>My Dashboard</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-950/40">Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-950/30" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                )}
              </div>
            </div>
          )}
        </header>

        <main className="flex-grow relative z-10">
          {children}
        </main>

        <button
          onClick={() => setIsAIChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-900 via-red-700 to-red-500 text-white p-4 rounded-full shadow-[0_0_18px_rgba(248,113,113,0.45)] hover:shadow-[0_0_22px_rgba(248,113,113,0.6)] transition transform hover:scale-105 z-50 flex items-center gap-2"
          aria-label="Open AI Concierge"
        >
          <Bot className="h-6 w-6" />
          <span className="font-medium hidden sm:inline">AI Concierge</span>
        </button>

        <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

        <footer className="bg-black/90 text-white border-t border-red-900/60 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center mb-4">
                  <img
                    src="/exotic_rentals.png"
                    alt="Exotic Rentals logo"
                    className="h-10 w-auto drop-shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                  />
                  <span className="ml-2 text-xl font-bold">Exotic Rentals</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Premium vehicle rentals for your next adventure. Experience the thrill of the open road.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-300 hover:text-white transition">About</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition">Blog</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Support</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-300 hover:text-white transition">Help Center</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300"><Phone className="h-4 w-4 mr-2" /> +1 (555) 123-4567</li>
                  <li className="flex items-center text-gray-300"><Mail className="h-4 w-4 mr-2" /> support@exoticrentals.com</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-red-900/60 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">&copy; 2024 Exotic Rentals. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Shield className="h-5 w-5 text-gray-500 hover:text-red-300 cursor-pointer" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
