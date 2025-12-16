import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Shield, MapPin, Gauge, Check, Info, ChevronLeft, ChevronRight } from 'lucide-react';
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
      // Ensure at least 1 day
      const days = diffDays > 0 ? diffDays : 1;
      setTotalPrice(days * car.pricePerDay);
    }
  }, [pickupDate, returnDate, car]);

  if (loading) {
    return <div className="p-12 text-center">Loading vehicle...</div>;
  }

  if (!car) {
    return <div className="p-12 text-center">{error || 'Vehicle not found'}</div>;
  }

  const handleBookNow = () => {
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates.");
      return;
    }
    // Navigate to checkout with state
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

  // Get all available images
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
    <div className="bg-gray-950 text-gray-100 min-h-screen pb-12">
      {/* Hero Image Gallery */}
      <div className="h-[400px] md:h-[60vh] relative w-full overflow-hidden">
        <img
          src={allImages[currentImageIndex]}
          alt={`${car.model} - Image ${currentImageIndex + 1}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_CAR_IMAGE;
          }}
          className="w-full h-full object-cover"
        />

        {/* Navigation Buttons (only show if multiple images) */}
        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition backdrop-blur-sm border border-white/20 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition backdrop-blur-sm border border-white/20 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium border border-white/20">
              {currentImageIndex + 1} / {totalImages}
            </div>

            {/* Thumbnail Indicators */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 px-4">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/40 w-1.5 hover:bg-white/60'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-4 border border-white/20">
            {car.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{car.make} {car.model} {car.year}</h1>
          <div className="flex items-center text-white/90 gap-4 text-sm md:text-base">
            <span className="flex items-center"><Gauge className="w-4 h-4 mr-1" /> {car.mpg}</span>
            <span>•</span>
            <span>{car.tripCount} trips completed</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold">★ {car.rating}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Specs & Info */}
        <div className="lg:col-span-2 space-y-10">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Vehicle Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {car.features && car.features.length > 0 ? (
                car.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-800">
                    <Check className="h-5 w-5 text-red-300 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-200">{feature}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-sm text-gray-400">No features provided for this vehicle.</div>
              )}
              {/* Default features inferred from types */}
              <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-800">
                <Check className="h-5 w-5 text-red-300 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">{car.transmission}</span>
              </div>
              <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-800">
                <Check className="h-5 w-5 text-red-300 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-200">{car.fuelType}</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              {car.description
                ? car.description
                : `Experience the ${car.year} ${car.make} ${car.model}. Whether you are planning a weekend getaway or a business trip, this ${car.category.toString().toLowerCase()} offers the perfect blend of performance, comfort, and style.`}
            </p>
          </section>

          <section className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h3 className="flex items-center text-lg font-bold text-white mb-2">
              <Shield className="h-5 w-5 mr-2 text-red-300" /> Insurance & Protection
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Basic insurance is included with all rentals. You can upgrade to Premium Protection during checkout for zero liability.
            </p>
            <div className="flex gap-4 text-sm text-gray-200">
              <span className="flex items-center"><Check className="h-4 w-4 mr-1 text-red-300" /> 24/7 Roadside Assist</span>
              <span className="flex items-center"><Check className="h-4 w-4 mr-1 text-red-300" /> Theft Protection</span>
            </div>
          </section>

        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 sticky top-24">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-gray-500 text-sm line-through block mb-1">${car.pricePerDay + 50}</span>
                <span className="text-3xl font-bold text-white">${car.pricePerDay}</span>
                <span className="text-gray-400"> / day</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-300 font-medium bg-green-900/40 px-2 py-1 rounded">Available Now</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Pickup Date</label>
                <div className="relative">
                  <input
                    type="date"
                    min={today}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-gray-950 rounded-lg focus:ring-red-400 focus:border-red-400 text-gray-100"
                  />
                  <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Return Date</label>
                <div className="relative">
                  <input
                    type="date"
                    min={pickupDate || today}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 bg-gray-950 rounded-lg focus:ring-red-400 focus:border-red-400 text-gray-100"
                  />
                  <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Location</label>
                <div className="relative">
                  <select className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg focus:ring-red-400 focus:border-red-400 bg-gray-950 text-gray-100">
                    <option>Los Angeles International Airport (LAX)</option>
                    <option>Downtown LA Office</option>
                    <option>Beverly Hills Hotel Delivery</option>
                  </select>
                  <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="border-t border-gray-800 pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>${car.pricePerDay} x {Math.round(totalPrice/car.pricePerDay)} days</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Security Deposit (Refundable)</span>
                  <span>${car.deposit}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white border-t border-gray-800 pt-2 mt-2">
                  <span>Total Due</span>
                  <span>${totalPrice + car.deposit}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleBookNow}
              disabled={!car.isAvailable}
              className="w-full bg-red-400 text-gray-900 py-3 px-4 rounded-xl font-bold hover:bg-red-300 transition shadow-lg hover:shadow-red-500/30 disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              {car.isAvailable ? 'Continue to Booking' : 'Not Available'}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              You won't be charged yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};