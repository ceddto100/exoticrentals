import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Shield, MapPin, Gauge, Check, ChevronLeft, ChevronRight, Star, Zap, Users, Settings, Fuel, Sparkles } from 'lucide-react';
import { FALLBACK_CAR_IMAGE } from '../constants';
import { Car, User } from '../types';
import { fetchVehicle } from '../services/apiClient';

interface VehicleDetailsProps {
  user: User | null;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;
      try {
        const response = await fetchVehicle(id);
        setCar(response);
        setError(null);
      } catch (err) {
        console.error('Unable to fetch vehicle from API', err);
        setError('Vehicle not found');
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  useEffect(() => {
    if (pickupDate && returnDate && car) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const days = diffDays > 0 ? diffDays : 1;
      setTotalPrice(days * car.pricePerDay);
    }
  }, [pickupDate, returnDate, car]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading vehicle...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card rounded-2xl p-12">
          <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Vehicle Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The vehicle you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="primary-gradient-btn px-6 py-3 rounded-xl text-white font-semibold"
          >
            Browse Fleet
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates.");
      return;
    }
    const vehicleId = car.id || car._id;
    navigate(`/checkout/${vehicleId}`, {
      state: {
        car,
        carId: vehicleId,
        pickupDate,
        returnDate,
        totalPrice
      }
    });
  };

  const today = new Date().toISOString().split('T')[0];

  const allImages = car.images && car.images.length > 0
    ? car.images.filter(img => img && img.trim())
    : car.imageUrl
      ? [car.imageUrl]
      : [FALLBACK_CAR_IMAGE];

  const totalImages = allImages.length;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Image Gallery */}
      <div className="h-[50vh] md:h-[65vh] relative w-full overflow-hidden">
        <img
          src={allImages[currentImageIndex]}
          alt={`${car.model} - Image ${currentImageIndex + 1}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_CAR_IMAGE;
          }}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />

        {/* Navigation Buttons */}
        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 glass-card hover:bg-red-500/20 text-white p-3 rounded-full transition-all duration-300 z-20 hover:border-red-500/50"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 glass-card hover:bg-red-500/20 text-white p-3 rounded-full transition-all duration-300 z-20 hover:border-red-500/50"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 glass-card px-4 py-2 rounded-full text-red-400 text-sm font-semibold z-20">
              {currentImageIndex + 1} / {totalImages}
            </div>

            {/* Thumbnail Indicators */}
            <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 px-4 z-20">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-red-400 w-10'
                      : 'bg-white/30 w-2 hover:bg-white/50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-1.5 rounded-full glass-card text-red-400 text-sm font-semibold border border-red-500/30">
              {car.category}
            </span>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full glass-card">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">{car.rating}</span>
            </div>
            {car.isAvailable && (
              <span className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold">
                Available Now
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3">
            {car.make} <span className="gradient-text">{car.model}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-300">
            <span className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-red-400" />
              {car.mpg}
            </span>
            <span className="text-gray-600">|</span>
            <span>{car.tripCount} trips completed</span>
            <span className="text-gray-600">|</span>
            <span>{car.year}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Specs & Info */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Specs */}
            <div className="glass-card rounded-2xl p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <Users className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{car.seats}</div>
                  <div className="text-sm text-gray-400">Seats</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <Settings className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{car.transmission}</div>
                  <div className="text-sm text-gray-400">Transmission</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  {car.fuelType === 'Electric' ? (
                    <Zap className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  ) : (
                    <Fuel className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  )}
                  <div className="text-lg font-bold text-white">{car.fuelType}</div>
                  <div className="text-sm text-gray-400">Fuel Type</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <Gauge className="h-6 w-6 text-red-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{car.mpg}</div>
                  <div className="text-sm text-gray-400">MPG</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-red-400" />
                Vehicle Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {car.features && car.features.length > 0 ? (
                  car.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-red-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-200">{feature}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-gray-400 text-center py-4">No additional features listed</div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Settings className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{car.transmission}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Fuel className="h-4 w-4 text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{car.fuelType}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">About This Vehicle</h2>
              <p className="text-gray-300 leading-relaxed">
                {car.description
                  ? car.description
                  : `Experience the ${car.year} ${car.make} ${car.model}. Whether you're planning a weekend getaway or a business trip, this ${car.category.toString().toLowerCase()} offers the perfect blend of performance, comfort, and style. Our AI-powered service ensures a seamless rental experience from start to finish.`}
              </p>
            </div>

            {/* Insurance */}
            <div className="glass-card rounded-2xl p-8 border-l-4 border-red-500">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Insurance & Protection</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Basic insurance is included with all rentals. Upgrade to Premium Protection during checkout for zero liability coverage.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-2 text-gray-300">
                      <Check className="h-4 w-4 text-red-400" /> 24/7 Roadside Assist
                    </span>
                    <span className="flex items-center gap-2 text-gray-300">
                      <Check className="h-4 w-4 text-red-400" /> Theft Protection
                    </span>
                    <span className="flex items-center gap-2 text-gray-300">
                      <Check className="h-4 w-4 text-red-400" /> Damage Coverage
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24 neon-border">
              {/* Price */}
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-red-500/20">
                <div>
                  <span className="text-gray-500 text-sm line-through block mb-1">${car.pricePerDay + 50}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black gradient-text">${car.pricePerDay}</span>
                    <span className="text-gray-400">/ day</span>
                  </div>
                </div>
                <div className="text-right">
                  {car.isAvailable ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      min={today}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 rounded-xl glass-card border border-slate-700/50 text-white focus:border-red-500/50 transition-colors"
                    />
                    <Calendar className="h-5 w-5 text-red-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Return Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      min={pickupDate || today}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 rounded-xl glass-card border border-slate-700/50 text-white focus:border-red-500/50 transition-colors"
                    />
                    <Calendar className="h-5 w-5 text-red-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Location</label>
                  <div className="relative">
                    <select className="block w-full pl-10 pr-4 py-3 rounded-xl glass-card border border-slate-700/50 text-white focus:border-red-500/50 transition-colors appearance-none">
                      <option>Los Angeles International Airport (LAX)</option>
                      <option>Downtown LA Office</option>
                      <option>Beverly Hills Hotel Delivery</option>
                    </select>
                    <MapPin className="h-5 w-5 text-red-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              {totalPrice > 0 && (
                <div className="border-t border-red-500/20 pt-4 mb-6 space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <span>${car.pricePerDay} x {Math.round(totalPrice/car.pricePerDay)} days</span>
                    <span className="text-white">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Security Deposit (Refundable)</span>
                    <span className="text-white">${car.deposit}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white border-t border-red-500/20 pt-3 mt-3">
                    <span>Total Due</span>
                    <span className="gradient-text">${totalPrice + car.deposit}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                disabled={!car.isAvailable}
                className="w-full primary-gradient-btn text-white py-4 px-6 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {car.isAvailable ? 'Continue to Booking' : 'Currently Unavailable'}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                You won't be charged yet. Final payment at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
