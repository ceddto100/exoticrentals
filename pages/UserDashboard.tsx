import React from 'react';
import { User } from '../types';
import { Clock, CheckCircle, FileText, CreditCard } from 'lucide-react';

export const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const pastBookings = [
    { id: 'b123', car: 'Tesla Model S', date: 'Oct 12 - Oct 15, 2024', status: 'Completed', cost: 567 },
    { id: 'b124', car: 'Porsche 911', date: 'Sep 01 - Sep 03, 2024', status: 'Completed', cost: 498 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-50" />
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            
            <div className="space-y-3 text-left">
              <button className="w-full flex items-center p-2 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm">
                <FileText className="w-4 h-4 mr-3" /> My Documents
              </button>
              <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-50 text-gray-600 font-medium text-sm transition">
                <CreditCard className="w-4 h-4 mr-3" /> Payment Methods
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Verification</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Driver's License</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Insurance</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Reservations</h1>
          
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-indigo-500 p-6 mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded">UPCOMING</span>
                <h3 className="text-lg font-bold text-gray-900">Mercedes-Benz G-Class</h3>
              </div>
              <p className="text-gray-600 flex items-center text-sm"><Clock className="w-4 h-4 mr-1"/> Pickup: Nov 24, 10:00 AM</p>
            </div>
            <button className="text-indigo-600 font-medium hover:text-indigo-800">Manage</button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Rental History</h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pastBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{b.car}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${b.cost}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{b.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm">Download</button>
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