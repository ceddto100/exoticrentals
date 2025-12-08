import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminVehicleForm, VehicleFormValues } from '../components/AdminVehicleForm';
import { fetchVehicle, updateVehicle } from '../services/apiClient';

export const AdminVehicleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<VehicleFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const vehicle = await fetchVehicle(id);
        setInitialValues({
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          category: vehicle.category || '',
          pricePerDay: vehicle.pricePerDay || 0,
          description: vehicle.description || '',
          mileage: vehicle.mileage ?? 0,
          deposit: vehicle.deposit ?? 0,
          transmission: vehicle.transmission || '',
          fuelType: vehicle.fuelType || '',
          seats: vehicle.seats ?? 4,
          mpg: vehicle.mpg || '',
          images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : vehicle.imageUrl ? [vehicle.imageUrl] : [''],
          features: vehicle.features && vehicle.features.length > 0 ? vehicle.features : [''],
          isAvailable: vehicle.isAvailable,
        });
        setLoadError(null);
      } catch (err: any) {
        console.error('Unable to load vehicle', err);
        setLoadError(err.message || 'Unable to load vehicle');
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const handleSubmit = async (values: VehicleFormValues) => {
    if (!id) {
      throw new Error('Vehicle ID missing');
    }
    await updateVehicle(id, values);
    navigate('/admin/fleet', { state: { message: 'Vehicle updated successfully.' } });
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/admin/fleet')} className="text-amber-300 flex items-center gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Fleet
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Vehicle</h1>
            <p className="text-gray-400">Update details and publish changes to the live fleet.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/fleet')}
              className="px-3 py-1 rounded-lg border border-gray-800 text-sm text-gray-200 hover:border-gray-600"
            >
              Cancel
            </button>
            {initialValues && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  initialValues.isAvailable ? 'bg-green-900/40 text-green-200' : 'bg-red-900/40 text-red-200'
                }`}
              >
                {initialValues.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            )}
          </div>
        </div>

        {loadError && !loading ? (
          <div className="mb-6 p-4 rounded-lg border border-red-800 bg-red-900/20 text-red-200">{loadError}</div>
        ) : (
          <AdminVehicleForm
            initialValues={initialValues}
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/admin/fleet')}
            submitLabel="Save Changes"
            successMessage="Vehicle updated successfully."
          />
        )}
      </div>
    </div>
  );
};
