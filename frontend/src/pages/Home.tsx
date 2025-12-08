import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, CarCategory, FuelType } from '../types';
import { fetchVehicles } from '../services/apiClient';
import { VehicleCard } from '../components/VehicleCard';

export const Home: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(300);

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
      const price = typeof car.pricePerDay === 'number' ? car.pricePerDay : 0;
      const priceMatch = price <= priceRange;
      return categoryMatch && priceMatch;
    });
  }, [selectedCategory, priceRange, cars]);

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[520px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Car"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center reveal-on-scroll">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight animate-fade-up">
            Drive Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">Dream</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mb-8 animate-fade-up" style={{ animationDelay: '0.08s', opacity: 0 }}>
            Experience the thrill of the open road with our premium fleet. Flexible booking, transparent pricing, and unforgettable journeys.
          </p>
          <div className="flex gap-4 animate-fade-up" style={{ animationDelay: '0.16s', opacity: 0 }}>
             <button onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })} className="bg-amber-400 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-amber-300 transition shadow-lg hover:shadow-amber-500/30 button-glow">
               Browse Fleet
             </button>
             <Link to="/how-it-works" className="px-8 py-3 rounded-full border border-gray-800 text-white hover:bg-gray-900 transition">
               How it Works
             </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div id="inventory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {['All', ...Object.values(CarCategory)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-gray-900 shadow-md'
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Price: <span className="text-amber-300 font-bold">${priceRange}/day</span>
              </label>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
          {error && (
            <div className="mt-4 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 reveal-on-scroll">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Available Vehicles</h2>
          <span className="text-gray-400 font-medium">{filteredCars.length} results found {loading && '(loading...)'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gray-900/70 border border-gray-800 rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <p className="uppercase text-sm tracking-[0.2em] text-amber-300 mb-2">How it works</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Luxury rentals without the friction</h2>
              <p className="text-gray-400 mt-3 max-w-2xl">Exotic Rentals makes it effortless to go from idea to ignition with concierge-style support, transparent pricing, and cars that arrive detailed and ready to impress.</p>
            </div>
            <div className="flex items-center gap-3 bg-black/40 border border-gray-800 px-4 py-3 rounded-2xl text-gray-200">
              <div className="h-10 w-10 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center font-bold">24/7</div>
              <div>
                <p className="text-sm font-semibold text-white">Concierge On Call</p>
                <p className="text-xs text-gray-400">Need a change? We re-route in minutes.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ title: 'Choose your exotic', copy: 'Filter by style, seats, or budget and lock in verified vehicles with real-time availability.', badge: 'Step 1' }, { title: 'Customize delivery', copy: 'Select airport, hotel, or curbside delivery. We confirm drop-off and pickup windows instantly.', badge: 'Step 2' }, { title: 'Drive with confidence', copy: 'Digital check-in, premium coverage options, and live chat support keep your trip on track.', badge: 'Step 3' }].map((step, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-2xl border border-gray-800 bg-black/40 p-6 shadow-xl">
                <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-amber-400 text-gray-900 mb-4">{step.badge}</span>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.copy}</p>
                <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-amber-400/10 blur-3xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};