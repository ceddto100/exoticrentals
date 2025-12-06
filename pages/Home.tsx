import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Star, Fuel, Settings, Users } from 'lucide-react';
import { MOCK_CARS } from '../constants';
import { CarCategory, FuelType } from '../types';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(300);

  const filteredCars = useMemo(() => {
    return MOCK_CARS.filter(car => {
      const categoryMatch = selectedCategory === 'All' || car.category === selectedCategory;
      const priceMatch = car.pricePerDay <= priceRange;
      return categoryMatch && priceMatch;
    });
  }, [selectedCategory, priceRange]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Car" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Drive Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Dream</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mb-8">
            Experience the thrill of the open road with our premium fleet. Flexible booking, transparent pricing, and unforgettable journeys.
          </p>
          <div className="flex gap-4">
             <button onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30">
               Browse Fleet
             </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div id="inventory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {['All', ...Object.values(CarCategory)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price: <span className="text-indigo-600 font-bold">${priceRange}/day</span>
              </label>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Available Vehicles</h2>
          <span className="text-gray-500 font-medium">{filteredCars.length} results found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <Link to={`/vehicle/${car.id}`} key={car.id} className="group">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                    {car.category}
                  </div>
                  {!car.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider">Booked</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{car.make} {car.model}</h3>
                    <div className="flex items-center text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-gray-600 text-sm ml-1 font-medium">{car.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-gray-500 mb-6 mt-2">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                      <Users className="h-4 w-4" /> {car.seats}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                      <Settings className="h-4 w-4" /> {car.transmission === 'Automatic' ? 'Auto' : 'Manual'}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                      <Fuel className="h-4 w-4" /> {car.fuelType}
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-2xl font-bold text-indigo-600">${car.pricePerDay}</span>
                      <span className="text-gray-400 text-sm"> / day</span>
                    </div>
                    <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition flex items-center">
                      Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};