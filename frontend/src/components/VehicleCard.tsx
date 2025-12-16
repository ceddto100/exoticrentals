import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Settings, Star, Users, Zap, ArrowRight } from 'lucide-react';
import { FALLBACK_CAR_IMAGE } from '../constants';
import { Car } from '../types';

interface VehicleCardProps {
  car: Car;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ car }) => {
  const imageSrc = car.imageUrl || car.images?.[0] || FALLBACK_CAR_IMAGE;
  const make = car.make || 'Unknown Make';
  const model = car.model || 'Vehicle';
  const category = car.category || 'Uncategorized';
  const year = car.year || '—';
  const price = typeof car.pricePerDay === 'number' ? car.pricePerDay : 0;
  const seats = car.seats ?? '—';
  const transmission = car.transmission || 'Unknown';
  const fuelType = car.fuelType || 'Unknown';
  const rating = car.rating ?? 5;
  const isAvailable = typeof car.isAvailable === 'boolean' ? car.isAvailable : true;

  return (
    <Link to={`/vehicle/${car.id}`} className="group block" aria-label={`${make} ${model}`}>
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:border-red-500/30 h-full flex flex-col neon-border">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageSrc}
            alt={`${make} ${model}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_CAR_IMAGE;
            }}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

          {/* Category Badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass-card text-xs font-bold text-red-400 border border-red-500/30">
            {category}
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 rounded-full glass-card">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-white">{rating}</span>
          </div>

          {/* Unavailable Overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
              <div className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-bold uppercase tracking-wider text-sm">
                Currently Booked
              </div>
            </div>
          )}

          {/* Hover overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Title and Year */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
              {make} {model}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{year}</p>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-sm text-gray-300">
              <Users className="h-4 w-4 text-red-500" />
              <span>{seats}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-sm text-gray-300">
              <Settings className="h-4 w-4 text-red-500" />
              <span>{transmission === 'Automatic' ? 'Auto' : transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-sm text-gray-300">
              {fuelType === 'Electric' ? (
                <Zap className="h-4 w-4 text-green-400" />
              ) : (
                <Fuel className="h-4 w-4 text-red-500" />
              )}
              <span>{fuelType}</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="mt-auto pt-4 border-t border-red-500/10 flex items-center justify-between">
            <div>
              <span className="text-2xl font-black gradient-text">${price}</span>
              <span className="text-gray-500 text-sm ml-1">/ day</span>
            </div>
            <div className="flex items-center gap-2 text-red-400 font-semibold text-sm group-hover:text-cyan-300 transition-colors">
              <span>View Details</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
