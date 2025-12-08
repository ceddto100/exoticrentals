import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Car, AddOn } from '../types';
import { FALLBACK_CAR_IMAGE } from '../constants';
import { CreditCard, Lock, FileText, CheckCircle } from 'lucide-react';

interface LocationState {
  car: Car;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
}

export const Checkout: React.FC<{ user: any }> = ({ user }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [availableAddOns] = useState<AddOn[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [processing, setProcessing] = useState(false);

  // Guard clause if user directly navigates here without state
  if (!state) {
    useEffect(() => { navigate('/'); }, [navigate]);
    return null;
  }

  const { car, pickupDate, returnDate, totalPrice } = state as LocationState;
  const primaryImage = car.imageUrl || car.images?.[0] || FALLBACK_CAR_IMAGE;

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = availableAddOns.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const securityDeposit = car.deposit ?? 0;
  const finalTotal = totalPrice + securityDeposit + addOnsTotal;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed || !signature) {
      alert("Please sign the rental agreement.");
      return;
    }
    
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      alert("Booking Confirmed! Check your dashboard.");
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Add-ons */}
            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-amber-300 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                Optional Add-ons
              </h2>
              <div className="space-y-3">
                {availableAddOns.length === 0 && (
                  <p className="text-sm text-gray-400">Optional add-ons are currently unavailable.</p>
                )}
                {availableAddOns.map(addon => (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddOn(addon.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                      selectedAddOns.includes(addon.id)
                        ? 'border-amber-300 bg-amber-400/10 ring-1 ring-amber-300'
                        : 'border-gray-800 hover:border-gray-700 bg-gray-950'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                        selectedAddOns.includes(addon.id) ? 'bg-amber-300 border-amber-300' : 'border-gray-700'
                      }`}>
                         {selectedAddOns.includes(addon.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{addon.name}</p>
                        <p className="text-sm text-gray-400">{addon.description}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-100">+${addon.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Driver Info (Pre-filled) */}
            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-amber-300 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Driver Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">Full Name</label>
                  <input type="text" disabled value={user.name} className="mt-1 block w-full bg-gray-950 border border-gray-800 rounded-md py-2 px-3 text-gray-400" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-200">Email</label>
                  <input type="text" disabled value={user.email} className="mt-1 block w-full bg-gray-950 border border-gray-800 rounded-md py-2 px-3 text-gray-400" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input type="text" placeholder="DL-XXXX-XXXX" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>

            {/* Step 3: Digital Agreement */}
            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-amber-300 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Rental Agreement
              </h2>
              <div className="bg-gray-950 p-4 rounded-lg h-40 overflow-y-auto text-xs text-gray-400 border border-gray-800 mb-4">
                <p className="font-bold text-white mb-2">RENTAL AGREEMENT TERMS AND CONDITIONS</p>
                <p>1. The Renter agrees to return the vehicle in the same condition as received...</p>
                <p>2. The Renter is responsible for all fuel, tolls, and fines incurred...</p>
                <p>3. Exotic Rentals is not liable for personal property left in the vehicle...</p>
                <p className="mt-2 text-gray-500 italic">(Scroll to read full terms...)</p>
              </div>
              <div className="space-y-4">
                 <label className="flex items-center">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 text-amber-400 border-gray-700 rounded bg-gray-900" />
                  <span className="ml-2 text-sm text-gray-200">I agree to the Terms and Conditions</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Electronic Signature (Type Full Name)</label>
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder={user.name}
                    className="block w-full border-b-2 border-gray-700 py-2 px-1 focus:border-amber-400 outline-none font-serif text-lg text-amber-200 bg-transparent placeholder-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">By typing your name, you execute this agreement electronically.</p>
                </div>
              </div>
            </div>

             {/* Step 4: Payment */}
            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-amber-300 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                Payment
              </h2>
              <form onSubmit={handlePayment}>
                <div className="space-y-4">
                  <div className="relative">
                     <label className="block text-sm font-medium text-gray-200 mb-1">Card Number</label>
                     <div className="relative">
                       <input type="text" placeholder="0000 0000 0000 0000" className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg focus:ring-amber-400 focus:border-amber-400 bg-gray-950 text-gray-100" />
                       <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="block w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-amber-400 focus:border-amber-400 bg-gray-950 text-gray-100" />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">CVC</label>
                      <input type="text" placeholder="123" className="block w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-amber-400 focus:border-amber-400 bg-gray-950 text-gray-100" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing || !agreed || !signature}
                  className="w-full mt-6 bg-amber-400 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-amber-300 transition shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2 disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" /> Pay ${finalTotal}
                    </>
                  )}
                </button>
                <div className="flex justify-center mt-4 text-xs text-gray-500 gap-4">
                  <span>Powered by Stripe</span>
                  <span>SSL Secured</span>
                </div>
              </form>
            </div>

          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
             <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-800">
                  <img
                    src={primaryImage}
                    alt="Car"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_CAR_IMAGE;
                    }}
                    className="w-20 h-14 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-bold text-white">{car.make} {car.model}</p>
                    <p className="text-xs text-gray-400">{car.year} • {car.category}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Dates</span>
                    <span className="font-medium text-white">{pickupDate} to {returnDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle Rental</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>Add-ons ({selectedAddOns.length})</span>
                    <span>${addOnsTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span>${securityDeposit}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                    <span className="font-bold text-white text-lg">Total</span>
                    <span className="font-bold text-amber-300 text-xl">${finalTotal}</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};