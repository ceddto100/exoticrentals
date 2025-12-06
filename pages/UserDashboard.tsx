import React, { useState } from 'react';
import { User } from '../types';
import { Clock, CheckCircle, FileText, CreditCard, RefreshCcw, XCircle, ShieldCheck } from 'lucide-react';

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [reservationStatus, setReservationStatus] = useState<'scheduled' | 'rescheduled' | 'canceled'>('scheduled');
  const [statusNote, setStatusNote] = useState('Pickup: Nov 24, 10:00 AM');

  const handleCancel = () => {
    setReservationStatus('canceled');
    setStatusNote('Reservation canceled. Refund processing to original payment method.');
  };

  const handleReschedule = () => {
    setReservationStatus('rescheduled');
    setStatusNote('Reschedule requested. Concierge will confirm the new time window.');
  };

  const pastBookings = [
    { id: 'b123', car: 'Tesla Model S', date: 'Oct 12 - Oct 15, 2024', status: 'Completed', cost: 567 },
    { id: 'b124', car: 'Porsche 911', date: 'Sep 01 - Sep 03, 2024', status: 'Completed', cost: 498 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen text-gray-100">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 text-center">
            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-amber-200/40" />
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm mb-6">{user.email}</p>
            
            <div className="space-y-3 text-left">
              <button className="w-full flex items-center p-2 rounded-lg bg-gray-800 text-gray-100 font-medium text-sm border border-gray-700">
                <FileText className="w-4 h-4 mr-3" /> My Documents
              </button>
              <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-800 text-gray-200 font-medium text-sm transition border border-gray-800">
                <CreditCard className="w-4 h-4 mr-3" /> Payment Methods
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 mt-6">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Verification</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Driver's License</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Insurance</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Email</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Upcoming Reservations</h1>

            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-amber-300 text-gray-900 text-xs font-bold px-2 py-0.5 rounded">UPCOMING</span>
                    <h3 className="text-lg font-bold text-white">Mercedes-Benz G-Class</h3>
                  </div>
                  <p className="text-gray-400 flex items-center text-sm"><Clock className="w-4 h-4 mr-1"/> {statusNote}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleReschedule} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-200 border border-gray-700">
                    <RefreshCcw className="w-4 h-4" /> Reschedule
                  </button>
                  <button onClick={handleCancel} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-100 border border-red-800">
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
              {reservationStatus !== 'scheduled' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>{reservationStatus === 'canceled' ? 'Your booking has been canceled safely.' : 'We have logged your reschedule request.'}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Payment Methods</h1>
            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Primary Card</p>
                  <p className="text-lg font-semibold text-white">Visa •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 09/27 • Default for deposits & refunds</p>
                </div>
                <span className="text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-300/50">Default</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <div>
                  <p className="text-sm text-gray-400">Backup Card</p>
                  <p className="text-lg font-semibold text-white">Amex •••• 6011</p>
                  <p className="text-xs text-gray-500">Expires 01/26 • Used if primary fails</p>
                </div>
                <button className="text-sm text-amber-300 hover:text-amber-200">Make Primary</button>
              </div>
              <button className="self-start mt-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 hover:bg-gray-700">Add New Payment Method</button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-6">Rental History</h1>
          <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-300 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pastBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-medium text-white">{b.car}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{b.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-100">${b.cost}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full">{b.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-amber-300 hover:text-amber-200 text-sm">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};