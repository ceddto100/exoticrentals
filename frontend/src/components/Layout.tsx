import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Car, LogOut, Menu, X, Shield, Phone, Mail, Bot } from "lucide-react";
import { AIChatModal } from "./AIChatModal";
import { AuthContext } from "../App";

interface LayoutProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

const FALLBACK_AVATAR = "/assets/car-placeholder.svg";

export const Layout: React.FC<LayoutProps> = ({ onLogout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const user = auth.user;

  // ===== Scroll Reveal =====
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "150px 0px" }
    );

    const observeNewElements = () => {
      const elements = document.querySelectorAll(".reveal-on-scroll:not(.visible)");
      elements.forEach((el) => {
        observer.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          (el as HTMLElement).classList.add("visible");
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

  // ===== Logout =====
  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-950/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <img
                src="/exotic_rentals.png"
                alt="Exotic Rentals logo"
                className="h-10 w-auto drop-shadow-sm"
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-200 hover:text-red-300 font-medium transition">
                Inventory
              </Link>

              <Link to="/how-it-works" className="text-gray-200 hover:text-red-300 font-medium transition">
                How it Works
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role === "admin" ? (
                    <Link to="/admin" className="text-red-300 font-medium hover:text-red-200">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="text-red-300 font-medium hover:text-red-200">
                      My Dashboard
                    </Link>
                  )}

                  <div className="flex items-center space-x-2 text-gray-100">
                    <img
                      src={user.avatarUrl || FALLBACK_AVATAR}
                      alt="User"
                      className="h-8 w-8 rounded-full border border-red-900/60 object-cover shadow-[0_0_12px_rgba(248,113,113,0.3)]"
                    />
                    <span className="font-medium">{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-200 hover:text-red-300 font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-200 hover:text-red-300 font-medium">
                  Log In
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 border-b border-red-900/60">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-red-300 hover:bg-red-950/30"
              >
                Inventory
              </Link>

              <Link
                to="/how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-red-300 hover:bg-red-950/30"
              >
                How it Works
              </Link>

              {user ? (
                <>
                  {user.role === "admin" ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-red-300 rounded-md text-base font-medium hover:bg-red-950/30"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-gray-200 rounded-md text-base font-medium hover:text-red-300 hover:bg-red-950/30"
                    >
                      My Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:bg-red-950/40"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-red-300 hover:bg-red-950/30"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT SLOT */}
      <main className="flex-grow relative z-10">{children}</main>

      {/* AI Button */}
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-900 via-red-700 to-red-500 text-white p-4 rounded-full shadow-[0_0_18px_rgba(248,113,113,0.45)] hover:shadow-[0_0_22px_rgba(248,113,113,0.6)] transition transform hover:scale-105 z-50 flex items-center gap-2"
      >
        <Bot className="h-6 w-6" />
        <span className="font-medium hidden sm:inline">AI Concierge</span>
      </button>

      <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* FOOTER */}
      <footer className="bg-black/90 text-white border-t border-red-900/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="h-8 w-8 text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.5)]" />
                <span className="ml-2 text-xl font-bold">Exotic Rentals</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium vehicle rentals for your next adventure. Experience the thrill of the open road.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-2" /> +1 (555) 123-4567
                </li>
                <li className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-2" /> support@exoticrentals.com
                </li>
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
  );
};
