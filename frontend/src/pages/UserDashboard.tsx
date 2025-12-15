
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../App';
import { Clock, FileText, CreditCard, ShieldCheck } from 'lucide-react';
import { fetchCustomerSchedules } from '../services/apiClient';

const DEFAULT_AVATAR = '/assets/car-placeholder.svg';

interface ScheduleRecord {
  _id: string;
  vehicleId: {
    _id: string;
    make: string;
    model: string;
    year: number;
    images: string[];
    dailyRate: number;
  };
  customerId: {
    _id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  depositAmount: number;
}

export const UserDashboard: React.FC = () => {
  const { auth } = useContext(AuthContext);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.user?.id) return;

    const loadSchedules = async () => {
      setLoading(true);
      try {
        const data = await fetchCustomerSchedules(auth.user.id);
        setSchedules(data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load your reservations';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [auth.user?.id]);

  if (!auth.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading user data...
      </div>
    );
  }

  const { name, email, avatarUrl } = auth.user;

  const upcoming = useMemo(() => {
    const now = new Date();
    return schedules.filter(schedule => new Date(schedule.endDate) >= now);
  }, [schedules]);

  const history = useMemo(() => {
    const now = new Date();
    return schedules.filter(schedule => new Date(schedule.endDate) < now);
  }, [schedules]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen text-gray-100">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 text-center">
            <img
              src={avatarUrl || DEFAULT_AVATAR}
              alt={name || 'User'}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-red-200/40"
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
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-300" /> Upcoming Reservations
              </h3>
              {loading && <span className="text-xs text-gray-500">Loading...</span>}
            </div>
            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
            {upcoming.length === 0 && !loading ? (
              <div className="text-sm text-gray-400">No upcoming reservations yet. Book your next ride to see it here.</div>
            ) : (
              <div className="space-y-3">
                {upcoming.map(schedule => (
                  <div
                    key={schedule._id}
                    className="p-4 rounded-lg border border-gray-800 bg-gray-950 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {schedule.vehicleId?.make} {schedule.vehicleId?.model}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block capitalize">{schedule.status || 'booked'}</span>
                      {schedule.depositAmount ? (
                        <span className="text-xs text-gray-400 block">Deposit: ${schedule.depositAmount.toFixed(2)}</span>
                      ) : null}
                      {schedule.totalPrice && <span className="text-sm font-semibold">Total: ${schedule.totalPrice.toFixed(2)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-300" /> Payment Methods
              </h3>
            </div>
            <div className="text-sm text-gray-400">
              No payment methods added yet. Save a card during checkout to speed up future bookings.
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-300" /> Rental History
              </h3>
            </div>
            {history.length === 0 && !loading ? (
              <div className="text-sm text-gray-400">You have no rental history yet. Completed trips will show here.</div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item._id} className="p-4 rounded-lg border border-gray-800 bg-gray-950">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">
                          {item.vehicleId?.make} {item.vehicleId?.model} ({item.vehicleId?.year || ''})
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block capitalize">{item.status || 'completed'}</span>
                        {item.totalPrice && <span className="text-sm font-semibold">${item.totalPrice.toFixed(2)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
