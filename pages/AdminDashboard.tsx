import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FALLBACK_CAR_IMAGE, MOCK_CARS } from '../constants';
import { DollarSign, Calendar, AlertCircle, Car as CarIcon, TrendingUp } from 'lucide-react';

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const availabilityData = [
  { name: 'Sedan', available: 12, booked: 4 },
  { name: 'SUV', available: 8, booked: 10 },
  { name: 'Luxury', available: 3, booked: 5 },
  { name: 'Sports', available: 5, booked: 2 },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Total Revenue</h3>
              <div className="p-2 bg-green-900/40 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-300" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">$24,500</p>
            <p className="text-xs text-green-300 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1"/> +12% from last week</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Active Bookings</h3>
              <div className="p-2 bg-black/70 border border-gray-800 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">42</p>
             <p className="text-xs text-gray-400 mt-1">8 pending approval</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Fleet Status</h3>
              <div className="p-2 bg-black/70 border border-gray-800 rounded-lg">
                <CarIcon className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">85%</p>
            <p className="text-xs text-gray-400 mt-1">Utilization Rate</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Maintenance</h3>
              <div className="p-2 bg-amber-900/40 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-gray-400 mt-1">Vehicles out of service</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-6">Weekly Revenue</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} prefix="$" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5'}} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-6">Fleet Availability by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={availabilityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none' }}/>
                  <Bar dataKey="available" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Available" />
                  <Bar dataKey="booked" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Booked" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Fleet Table */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Fleet Management</h3>
            <button className="bg-amber-300 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-200">Add New Vehicle</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-300 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rate</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {MOCK_CARS.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-800/60 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={car.imageUrl}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_CAR_IMAGE;
                          }}
                          className="w-10 h-10 rounded-md object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium text-white">{car.make} {car.model}</div>
                          <div className="text-xs text-gray-400">{car.year} • {car.tripCount} trips</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{car.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        car.isAvailable ? 'bg-green-900/30 text-green-200' : 'bg-red-900/30 text-red-200'
                      }`}>
                        {car.isAvailable ? 'Available' : 'Booked/Service'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">${car.pricePerDay}/day</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-amber-300 hover:text-amber-200 text-sm font-medium">Edit</button>
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