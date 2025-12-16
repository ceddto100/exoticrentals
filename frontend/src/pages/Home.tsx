import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, CarCategory, FuelType } from '../types';
import { fetchVehicles } from '../services/apiClient';
import { VehicleCard } from '../components/VehicleCard';
import { Sparkles, Zap, Shield, Clock, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

export const Home: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true);
        const response = await fetchVehicles();
        setCars(response);
        setError(null);
      } catch (err) {
        console.error('Unable to load vehicles', err);
        setError('Live vehicle feed unavailable.');
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const categoryMatch = selectedCategory === 'All' || car.category === selectedCategory;
      return categoryMatch;
    });
  }, [selectedCategory, cars]);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] overflow-hidden flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Car"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          {/* Animated color overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/10 animate-pulse" style={{ animationDuration: '4s' }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-red-400 text-sm font-medium mb-8 animate-fade-up">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Luxury Experience</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
              The Future of
              <span className="block gradient-text">Exotic Rentals</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-300 max-w-xl mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Experience tomorrow's luxury today. AI-curated selections, seamless booking, and vehicles that define the cutting edge.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
                className="primary-gradient-btn text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 group"
              >
                Explore Fleet
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/how-it-works"
                className="holo-button px-8 py-4 rounded-2xl font-semibold text-white flex items-center gap-2"
              >
                How it Works
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {[
                { value: '50+', label: 'Exotic Vehicles' },
                { value: '24/7', label: 'AI Support' },
                { value: '99%', label: 'Satisfaction' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center md:text-left">
                  <div className="text-3xl md:text-4xl font-black gradient-text">{stat.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-red-500/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-red-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div id="inventory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="glass-card rounded-3xl p-8 neon-border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Category Pills */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter by Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', ...Object.values(CarCategory)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'primary-gradient-btn text-white'
                        : 'glass-card text-gray-300 hover:text-red-400 hover:border-red-500/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{filteredCars.length}</div>
                <div className="text-sm text-gray-400">vehicles available</div>
              </div>
              {loading && (
                <div className="h-8 w-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-center mb-10 reveal-on-scroll">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Available <span className="gradient-text">Fleet</span>
            </h2>
            <p className="text-gray-400">Hand-picked luxury vehicles ready for your journey</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children reveal-on-scroll">
          {filteredCars.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>

        {filteredCars.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-card mb-6">
              <Search className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No vehicles found</h3>
            <p className="text-gray-400">Try adjusting your filters to find more options</p>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/20 to-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-red-500/20 to-red-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12 reveal-on-scroll">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-red-400 text-sm font-medium mb-4">
                  <Zap className="h-4 w-4" />
                  <span>Seamless Experience</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                  How It <span className="gradient-text">Works</span>
                </h2>
                <p className="text-gray-400 max-w-xl text-lg">
                  From selection to ignition in minutes. Our AI-powered platform makes luxury rentals effortless.
                </p>
              </div>

              {/* Support Badge */}
              <div className="flex items-center gap-4 glass-card px-6 py-4 rounded-2xl">
                <div className="h-14 w-14 rounded-xl primary-gradient-btn flex items-center justify-center text-white font-black text-xl">
                  24/7
                </div>
                <div>
                  <p className="text-white font-semibold">AI Concierge</p>
                  <p className="text-gray-400 text-sm">Always here to help</p>
                </div>
              </div>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-on-scroll">
              {[
                {
                  step: '01',
                  title: 'Choose Your Exotic',
                  description: 'Browse our AI-curated collection. Filter by style, performance, or let our algorithm suggest the perfect match.',
                  icon: Search,
                  color: 'cyan',
                },
                {
                  step: '02',
                  title: 'Customize Delivery',
                  description: 'Select airport, hotel, or curbside delivery. Real-time tracking and instant confirmation.',
                  icon: Clock,
                  color: 'purple',
                },
                {
                  step: '03',
                  title: 'Drive with Confidence',
                  description: 'Digital check-in, premium coverage, and live AI support keep your journey smooth.',
                  icon: Shield,
                  color: 'pink',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative glass-card rounded-2xl p-8 transition-all duration-500 hover:border-red-500/30 neon-border"
                >
                  {/* Step number */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${
                    item.color === 'cyan' ? 'bg-red-500/20 text-red-400' :
                    item.color === 'purple' ? 'bg-red-500/20 text-red-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    <item.icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="text-xs font-bold text-gray-500 tracking-wider mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>

                  {/* Decorative gradient */}
                  <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    item.color === 'cyan' ? 'bg-red-500/20' :
                    item.color === 'purple' ? 'bg-red-500/20' :
                    'bg-red-500/20'
                  }`}></div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center reveal-on-scroll">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-red-400 font-semibold hover:text-cyan-300 transition-colors group"
              >
                Learn more about our process
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 mb-20">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Why Choose <span className="gradient-text">Exotic Rentals</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're not just a rental service. We're your gateway to unforgettable experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal-on-scroll">
          {[
            { icon: Sparkles, title: 'AI-Powered', desc: 'Smart recommendations based on your preferences', color: 'cyan' },
            { icon: Shield, title: 'Fully Insured', desc: 'Comprehensive coverage for peace of mind', color: 'purple' },
            { icon: Zap, title: 'Instant Booking', desc: 'Reserve your dream car in seconds', color: 'pink' },
            { icon: Clock, title: '24/7 Support', desc: 'Always available when you need us', color: 'cyan' },
          ].map((feature, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 text-center group hover:border-red-500/30 transition-all duration-300">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
                feature.color === 'cyan' ? 'bg-red-500/20 text-red-400' :
                feature.color === 'purple' ? 'bg-red-500/20 text-red-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
