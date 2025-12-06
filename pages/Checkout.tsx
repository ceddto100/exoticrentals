import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Car, AddOn } from '../types';
import { ADD_ONS } from '../constants';
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
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [processing, setProcessing] = useState(false);

  // Guard clause if user directly navigates here without state
  if (!state) {
    useEffect(() => { navigate('/'); }, [navigate]);
    return null;
  }

  const { car, pickupDate, returnDate, totalPrice } = state as LocationState;

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = ADD_ONS.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const finalTotal = totalPrice + car.deposit + addOnsTotal;

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Step 1: Add-ons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                Optional Add-ons
              </h2>
              <div className="space-y-3">
                {ADD_ONS.map(addon => (
                  <div 
                    key={addon.id} 
                    onClick={() => handleToggleAddOn(addon.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                      selectedAddOns.includes(addon.id) 
                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                        selectedAddOns.includes(addon.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                      }`}>
                         {selectedAddOns.includes(addon.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{addon.name}</p>
                        <p className="text-sm text-gray-500">{addon.description}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">+${addon.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Driver Info (Pre-filled) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Driver Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" disabled value={user.name} className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-600" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="text" disabled value={user.email} className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-600" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input type="text" placeholder="DL-XXXX-XXXX" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>

            {/* Step 3: Digital Agreement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Rental Agreement
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg h-40 overflow-y-auto text-xs text-gray-600 border border-gray-200 mb-4">
                <p className="font-bold mb-2">RENTAL AGREEMENT TERMS AND CONDITIONS</p>
                <p>1. The Renter agrees to return the vehicle in the same condition as received...</p>
                <p>2. The Renter is responsible for all fuel, tolls, and fines incurred...</p>
                <p>3. Velocita Rentals is not liable for personal property left in the vehicle...</p>
                <p className="mt-2 text-gray-400 italic">(Scroll to read full terms...)</p>
              </div>
              <div className="space-y-4">
                 <label className="flex items-center">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">I agree to the Terms and Conditions</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Electronic Signature (Type Full Name)</label>
                  <input 
                    type="text" 
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder={user.name}
                    className="block w-full border-b-2 border-gray-300 py-2 px-1 focus:border-indigo-600 outline-none font-serif text-lg text-indigo-900 bg-transparent placeholder-gray-300" 
                  />
                  <p className="text-xs text-gray-400 mt-1">By typing your name, you execute this agreement electronically.</p>
                </div>
              </div>
            </div>

             {/* Step 4: Payment */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                Payment
              </h2>
              <form onSubmit={handlePayment}>
                <div className="space-y-4">
                  <div className="relative">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                     <div className="relative">
                       <input type="text" placeholder="0000 0000 0000 0000" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                       <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input type="text" placeholder="123" className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={processing || !agreed || !signature}
                  className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" /> Pay ${finalTotal}
                    </>
                  )}
                </button>
                <div className="flex justify-center mt-4 text-xs text-gray-400 gap-4">
                  <span>Powered by Stripe</span>
                  <span>SSL Secured</span>
                </div>
              </form>
            </div>

          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                  <img src={car.imageUrl} alt="Car" className="w-20 h-14 object-cover rounded-md" />
                  <div>
                    <p className="font-bold text-gray-900">{car.make} {car.model}</p>
                    <p className="text-xs text-gray-500">{car.year} • {car.category}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Dates</span>
                    <span className="font-medium text-gray-900">{pickupDate} to {returnDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle Rental</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-indigo-600">
                    <span>Add-ons ({selectedAddOns.length})</span>
                    <span>${addOnsTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span>${car.deposit}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-bold text-indigo-600 text-xl">${finalTotal}</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};