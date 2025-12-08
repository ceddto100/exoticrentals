import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Settings, Star, Users } from 'lucide-react';
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
    <Link to={`/vehicle/${car.id}`} className="group" aria-label={`${make} ${model}`}>
      <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 h-full flex flex-col reveal-on-scroll">
        <div className="relative h-56 overflow-hidden">
          <img
            src={imageSrc}
            alt={`${make} ${model}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_CAR_IMAGE;
            }}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-red-300 shadow-sm border border-red-300/40">
            {category}
          </div>
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider">Booked</span>
            </div>
          )}
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white">{make} {model}</h3>
            <div className="flex items-center text-red-300" aria-label={`Rating ${rating}`}>
              <Star className="h-4 w-4 fill-current" />
              <span className="text-gray-300 text-sm ml-1 font-medium">{rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">{year}</p>

          <div className="flex gap-4 text-sm text-gray-300 mb-6 mt-2">
            <div className="flex items-center gap-1.5 bg-gray-800 px-2 py-1 rounded" title="Seats">
              <Users className="h-4 w-4" /> {seats}
            </div>
            <div className="flex items-center gap-1.5 bg-gray-800 px-2 py-1 rounded" title="Transmission">
              <Settings className="h-4 w-4" /> {transmission === 'Automatic' ? 'Auto' : transmission}
            </div>
            <div className="flex items-center gap-1.5 bg-gray-800 px-2 py-1 rounded" title="Fuel type">
              <Fuel className="h-4 w-4" /> {fuelType}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-gray-800 pt-4">
            <div>
              <span className="text-2xl font-bold text-red-300">${price}</span>
              <span className="text-gray-400 text-sm"> / day</span>
            </div>
            <span className="text-red-300 font-semibold group-hover:translate-x-1 transition flex items-center">
              Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
