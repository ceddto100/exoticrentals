import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { FALLBACK_CAR_IMAGE } from '../constants';
import { DollarSign, Calendar, AlertCircle, Car as CarIcon, TrendingUp, Trash2, Clock, Plus, Edit, Sparkles, Shield, Zap, Users } from 'lucide-react';
import { deleteVehicle, fetchSchedules, fetchVehicles } from '../services/apiClient';
import { Car } from '../types';

interface ScheduleRecord {
  _id: string;
  vehicleId: {
    _id: string;
    make: string;
    model: string;
    year: number;
    images?: string[];
  } | null;
  customerId: {
    _id: string;
    name: string;
    email?: string;
  } | null;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  depositAmount: number;
}

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

export const AdminDashboard: React.FC = () => {
  const [fleet, setFleet] = useState<Car[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    userCount: 0,
    vehicleCount: 0,
    activeRentals: 0,
    historyCount: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setToast((location.state as any).message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [schedulesData, vehicles] = await Promise.all([fetchSchedules(), fetchVehicles()]);
        setSchedules(schedulesData || []);
        setStats({
          userCount: 0,
          vehicleCount: vehicles.length,
          activeRentals: schedulesData.length,
          historyCount: 0,
        });
        setFleet(vehicles);
        setError(null);
      } catch (error) {
        console.error('Admin API unavailable', error);
        setError('Unable to load admin dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const upcomingReservations = schedules.filter(schedule => {
    const endDate = new Date(schedule.endDate);
    return endDate >= new Date();
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const handleDelete = async (vehicleId: string) => {
    if (deletingId) return;

    const confirmed = window.confirm('Are you sure you want to delete this vehicle?');
    if (!confirmed) return;

    setDeletingId(vehicleId);
    setError(null);

    try {
      await deleteVehicle(vehicleId);
      setFleet((current) => current.filter((car) => car.id !== vehicleId));
      setStats((prev) => ({ ...prev, vehicleCount: Math.max(0, prev.vehicleCount - 1) }));
      setToast('Vehicle deleted successfully.');
    } catch (err: any) {
      console.error('Unable to delete vehicle', err);
      setError(err?.message || 'Failed to delete vehicle.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl primary-gradient-btn flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-white">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
            </div>
            <p className="text-gray-400">Manage your fleet and monitor performance</p>
          </div>
          <button
            className="primary-gradient-btn px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2"
            onClick={() => navigate('/admin/vehicles/add')}
          >
            <Plus className="h-5 w-5" />
            Add Vehicle
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl glass-card border-l-4 border-pink-500 text-pink-300 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {toast && (
          <div className="mb-6 p-4 rounded-xl glass-card border-l-4 border-green-500 text-green-300 flex items-center gap-3">
            <Sparkles className="h-5 w-5 flex-shrink-0" />
            {toast}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 group hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Total Revenue</h3>
              <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-black gradient-text">${(stats.historyCount * 120).toLocaleString()}</p>
            <p className="text-sm text-green-400 flex items-center mt-2">
              <TrendingUp className="w-4 h-4 mr-1"/> +12% from last week
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 group hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Active Bookings</h3>
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stats.activeRentals}</p>
            <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              {loading ? 'Syncing...' : 'Live data'}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 group hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Fleet Size</h3>
              <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{stats.vehicleCount}</p>
            <p className="text-sm text-gray-400 mt-2">Total vehicles</p>
          </div>

          <div className="glass-card rounded-2xl p-6 group hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium">Maintenance</h3>
              <div className="h-10 w-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">3</p>
            <p className="text-sm text-pink-400 mt-2">Requires attention</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Weekly Revenue
              </h3>
              <span className="text-sm text-gray-400">Last 7 days</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: '12px',
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Reservations */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Upcoming Reservations
              </h3>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                {upcomingReservations.length} pending
              </span>
            </div>
            <div className="h-72 overflow-y-auto pr-2 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
                </div>
              ) : upcomingReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Calendar className="h-12 w-12 mb-3 text-gray-600" />
                  <p>No upcoming reservations</p>
                </div>
              ) : (
                upcomingReservations.map((reservation) => (
                  <div
                    key={reservation._id}
                    className="p-4 rounded-xl glass-card border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white">
                          {reservation.vehicleId?.make || 'Unknown'} {reservation.vehicleId?.model || 'Vehicle'}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {reservation.customerId?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          reservation.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          reservation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {reservation.status || 'pending'}
                        </span>
                        <p className="text-lg font-bold gradient-text mt-2">
                          ${reservation.totalPrice?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Fleet Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-cyan-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CarIcon className="w-5 h-5 text-cyan-400" />
                Fleet Management
              </h3>
              <p className="text-sm text-gray-400 mt-1">Manage your vehicle inventory</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-gray-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rate</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {fleet.map((car) => {
                  const imageSrc = car.imageUrl || car.images?.[0] || FALLBACK_CAR_IMAGE;
                  const make = car.make || 'Unknown Make';
                  const model = car.model || 'Vehicle';
                  const category = car.category || 'Uncategorized';
                  const year = car.year || '—';
                  const trips = car.tripCount ?? 0;
                  const price = typeof car.pricePerDay === 'number' ? car.pricePerDay : 0;
                  const isAvailable = typeof car.isAvailable === 'boolean' ? car.isAvailable : true;

                  return (
                    <tr key={car.id} className="hover:bg-cyan-500/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={imageSrc}
                            alt={`${make} ${model}`}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = FALLBACK_CAR_IMAGE;
                            }}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-700/50"
                          />
                          <div>
                            <div className="font-semibold text-white">{make} {model}</div>
                            <div className="text-xs text-gray-400">{year} • {trips} trips</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full glass-card text-sm text-cyan-400 border border-cyan-500/30">
                          {category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          isAvailable
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        }`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-pink-400'}`}></div>
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold gradient-text">${price}</span>
                        <span className="text-gray-400 text-sm">/day</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 rounded-lg glass-card text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-all"
                            onClick={() => navigate(`/admin/vehicles/${car.id}/edit`)}
                            title="Edit vehicle"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg glass-card text-pink-400 hover:text-pink-300 hover:border-pink-500/50 transition-all disabled:opacity-50"
                            onClick={() => handleDelete(car.id)}
                            disabled={deletingId === car.id}
                            title="Delete vehicle"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {fleet.length === 0 && !loading && (
              <div className="text-center py-12">
                <CarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No vehicles in fleet</p>
                <button
                  className="mt-4 primary-gradient-btn px-6 py-2 rounded-xl text-white font-semibold"
                  onClick={() => navigate('/admin/vehicles/add')}
                >
                  Add Your First Vehicle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
