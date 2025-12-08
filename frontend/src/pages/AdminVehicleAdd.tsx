import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminVehicleForm, VehicleFormValues } from '../components/AdminVehicleForm';
import { createVehicle } from '../services/apiClient';

const defaultValues: VehicleFormValues = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  category: '',
  pricePerDay: 0,
  description: '',
  mileage: 0,
  deposit: 0,
  transmission: '',
  fuelType: '',
  seats: 4,
  mpg: '',
  images: [''],
  features: [''],
  isAvailable: true,
};

export const AdminVehicleAdd: React.FC = () => {
  const navigate = useNavigate();
  const [initialValues] = useState<VehicleFormValues>(defaultValues);

  const handleSubmit = async (values: VehicleFormValues) => {
    await createVehicle(values);
    navigate('/admin/fleet', { state: { message: 'Vehicle created successfully.' } });
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/admin/fleet')} className="text-amber-300 flex items-center gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Fleet
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Add Vehicle</h1>
            <p className="text-gray-400">Publish a new vehicle to the fleet inventory.</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900/40 text-green-200">Available</span>
        </div>

        <AdminVehicleForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/fleet')}
          submitLabel="Save Vehicle"
          successMessage="Vehicle created successfully."
        />
      </div>
    </div>
  );
};
