
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App'; // Import the auth context
import { Clock, CheckCircle, FileText, CreditCard, RefreshCcw, XCircle, ShieldCheck } from 'lucide-react';

// A default avatar to prevent crashes if the user's avatar is missing.
const DEFAULT_AVATAR = '/assets/car-placeholder.svg';

export const UserDashboard: React.FC = () => {
  const { auth } = useContext(AuthContext); // Get auth state from context

  // State for managing UI elements
  const [reservationStatus, setReservationStatus] = useState<'scheduled' | 'rescheduled' | 'canceled'>('scheduled');
  const [statusNote, setStatusNote] = useState('Pickup: Nov 24, 10:00 AM');
  const [showReschedulePicker, setShowReschedulePicker] = useState(false);
  const [rescheduleAt, setRescheduleAt] = useState('2024-11-24T10:00');

  // Early exit if auth or user is not available. This prevents crashes.
  if (!auth.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading user data...
      </div>
    );
  }

  // Safely access user properties.
  const { name, email, avatarUrl } = auth.user;

  const handleCancel = () => {
    setReservationStatus('canceled');
    setStatusNote('Reservation canceled. Refund processing to original payment method.');
    setShowReschedulePicker(false);
  };

  const handleRescheduleConfirm = () => {
    setReservationStatus('rescheduled');
    const chosenDate = new Date(rescheduleAt);
    const formatted = `${chosenDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${chosenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setStatusNote(`Rescheduled to ${formatted}`);
    setShowReschedulePicker(false);
  };

  const pastBookings = [
    { id: 'b123', car: 'Tesla Model S', date: 'Oct 12 - Oct 15, 2024', status: 'Completed', cost: 567 },
    { id: 'b124', car: 'Porsche 911', date: 'Sep 01 - Sep 03, 2024', status: 'Completed', cost: 498 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen text-gray-100">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 text-center">
            {/* Use optional chaining and a fallback for the avatar URL */}
            <img 
              src={avatarUrl || DEFAULT_AVATAR} 
              alt={name || 'User'} 
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-amber-200/40"
            />
            <h2 className="text-xl font-bold text-white">{name || 'Customer'}</h2>
            <p className="text-gray-400 text-sm mb-6">{email}</p>
            <div className="space-y-3 text-left">
              <button className="w-full flex items-center p-2 rounded-lg bg-gray-800 text-gray-100 font-medium text-sm border border-gray-700">
                <FileText className="w-4 h-4 mr-3" /> My Documents
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
           {/* ... rest of the dashboard UI ... */}
        </div>
      </div>
    </div>
  );
};
