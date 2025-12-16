import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, Shield, Phone, Mail, Bot, Sparkles, Zap, Globe } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const user = auth.user;

  // Handle scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen flex flex-col text-gray-100">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-card border-b border-cyan-500/20'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <img
                  src="/exotic_rentals.png"
                  alt="Exotic Rentals logo"
                  className="h-10 w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                />
              </div>
              <span className="ml-3 text-lg font-bold hidden sm:block gradient-text">
                EXOTIC RENTALS
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-cyan-400 font-medium transition-all duration-300 hover:bg-cyan-500/10"
              >
                Inventory
              </Link>

              <Link
                to="/how-it-works"
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-cyan-400 font-medium transition-all duration-300 hover:bg-cyan-500/10"
              >
                How it Works
              </Link>

              {user ? (
                <div className="flex items-center space-x-3 ml-4">
                  {user.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="px-4 py-2 rounded-lg text-purple-400 font-medium transition-all duration-300 hover:bg-purple-500/10 flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-lg text-cyan-400 font-medium transition-all duration-300 hover:bg-cyan-500/10"
                    >
                      Dashboard
                    </Link>
                  )}

                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-full glass-card">
                    <div className="relative status-online">
                      <img
                        src={user.avatarUrl || FALLBACK_AVATAR}
                        alt="User"
                        className="h-8 w-8 rounded-full border-2 border-cyan-500/50 object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm text-gray-200">{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-pink-400 font-medium transition-all duration-300 hover:bg-pink-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-6 py-2 rounded-full primary-gradient-btn text-white font-semibold text-sm"
                >
                  Sign In
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg glass-card text-gray-300 hover:text-cyan-400 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-cyan-500/20 animate-fade-up">
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
              >
                Inventory
              </Link>

              <Link
                to="/how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-200 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
              >
                How it Works
              </Link>

              {user ? (
                <>
                  {user.role === "admin" ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-purple-400 rounded-lg text-base font-medium hover:bg-purple-500/10 transition-all"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-cyan-400 rounded-lg text-base font-medium hover:bg-cyan-500/10 transition-all"
                    >
                      My Dashboard
                    </Link>
                  )}

                  <div className="border-t border-cyan-500/20 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium primary-gradient-btn text-white rounded-lg text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* MAIN CONTENT SLOT */}
      <main className="flex-grow relative z-10">{children}</main>

      {/* AI Button */}
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-6 right-6 primary-gradient-btn text-white p-4 rounded-2xl animate-pulse-glow transition-all duration-300 hover:scale-105 z-50 flex items-center gap-2 group"
      >
        <div className="relative">
          <Bot className="h-6 w-6" />
          <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
        </div>
        <span className="font-semibold hidden sm:inline">AI Concierge</span>
      </button>

      <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-cyan-500/20">
        {/* Gradient line at top */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        <div className="glass-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center mb-6">
                  <img
                    src="/exotic_rentals.png"
                    alt="Exotic Rentals logo"
                    className="h-10 w-auto"
                  />
                  <span className="ml-3 text-xl font-bold gradient-text">EXOTIC</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  The future of luxury vehicle rentals. AI-powered recommendations, seamless booking, unforgettable experiences.
                </p>
                <div className="flex items-center gap-2 text-xs text-cyan-400">
                  <Zap className="h-4 w-4" />
                  <span>Powered by Advanced AI</span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
                  <span className="h-px w-4 bg-gradient-to-r from-cyan-500 to-transparent"></span>
                  Quick Links
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>
                      Browse Fleet
                    </Link>
                  </li>
                  <li>
                    <Link to="/how-it-works" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>
                      About Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
                  <span className="h-px w-4 bg-gradient-to-r from-purple-500 to-transparent"></span>
                  Support
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors"></span>
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors"></span>
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="h-1 w-1 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors"></span>
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
                  <span className="h-px w-4 bg-gradient-to-r from-pink-500 to-transparent"></span>
                  Contact
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-400 text-sm group">
                    <Phone className="h-4 w-4 mr-3 text-pink-500/70" />
                    <span className="group-hover:text-pink-400 transition-colors">+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-center text-gray-400 text-sm group">
                    <Mail className="h-4 w-4 mr-3 text-pink-500/70" />
                    <span className="group-hover:text-pink-400 transition-colors">support@exoticrentals.com</span>
                  </li>
                  <li className="flex items-center text-gray-400 text-sm group">
                    <Globe className="h-4 w-4 mr-3 text-pink-500/70" />
                    <span className="group-hover:text-pink-400 transition-colors">Available 24/7</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-cyan-500/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                &copy; 2024 Exotic Rentals. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>All Systems Operational</span>
                </div>
                <Shield className="h-5 w-5 text-gray-600 hover:text-cyan-400 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
