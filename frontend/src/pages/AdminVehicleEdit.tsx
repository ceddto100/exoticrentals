import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Plus, Trash } from 'lucide-react';
import { FALLBACK_CAR_IMAGE } from '../constants';
import { fetchVehicle, updateVehicle, VehiclePayload } from '../services/apiClient';
import { CarCategory, FuelType, Transmission } from '../types';

interface VehicleFormState extends VehiclePayload {
  year: number;
}

export const AdminVehicleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<VehicleFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const vehicle = await fetchVehicle(id);
        setForm({
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
          images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : vehicle.imageUrl ? [vehicle.imageUrl] : [],
          features: vehicle.features || [],
          isAvailable: vehicle.isAvailable,
        });
        setError(null);
      } catch (err: any) {
        console.error('Unable to load vehicle', err);
        setError(err.message || 'Unable to load vehicle');
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const handleChange = (field: keyof VehicleFormState, value: any) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  const updateArrayField = (
    key: 'images' | 'features',
    index: number,
    value: string
  ) => {
    if (!form) return;
    const updated = [...form[key]];
    updated[index] = value;
    setForm({ ...form, [key]: updated });
  };

  const handleAddField = (key: 'images' | 'features') => {
    if (!form) return;
    setForm({ ...form, [key]: [...form[key], ''] });
  };

  const handleRemoveField = (key: 'images' | 'features', index: number) => {
    if (!form) return;
    const updated = form[key].filter((_, idx) => idx !== index);
    setForm({ ...form, [key]: updated });
  };

  const handleImageFile = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!form) return;
      const updated = [...form.images];
      updated[index] = String(reader.result);
      setForm({ ...form, images: updated });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id || !form) return;

    const trimmedImages = form.images.map((img) => img.trim()).filter(Boolean);
    const trimmedFeatures = form.features.map((feat) => feat.trim()).filter(Boolean);

    const validationErrors: string[] = [];
    if (!form.make.trim()) validationErrors.push('Make is required.');
    if (!form.model.trim()) validationErrors.push('Model is required.');
    if (!form.pricePerDay || form.pricePerDay <= 0) validationErrors.push('Daily rate is required.');
    if (typeof form.isAvailable !== 'boolean') validationErrors.push('Availability is required.');
    if (trimmedImages.length === 0) validationErrors.push('At least one image is required.');

    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateVehicle(id, {
        ...form,
        images: trimmedImages,
        features: trimmedFeatures,
      });
      setSuccess('Vehicle updated successfully.');
      setTimeout(() => {
        navigate('/admin', { state: { message: 'Vehicle updated successfully.' } });
      }, 600);
    } catch (err: any) {
      console.error('Failed to update vehicle', err);
      setError(err.message || 'Failed to update vehicle.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="bg-gray-950 min-h-screen text-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-amber-300 flex items-center gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">Loading vehicle...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-amber-300 flex items-center gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Vehicle</h1>
            <p className="text-gray-400">Update details and publish changes to the live fleet.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${form.isAvailable ? 'bg-green-900/40 text-green-200' : 'bg-red-900/40 text-red-200'}`}>
            {form.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg border border-red-800 bg-red-900/20 text-red-200">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-4 rounded-lg border border-green-800 bg-green-900/30 text-green-100 flex items-center gap-2">
            <Check className="h-4 w-4" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Make *</label>
                <input
                  type="text"
                  value={form.make}
                  onChange={(e) => handleChange('make', e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Model *</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Year *</label>
                  <input
                    type="number"
                    min="1900"
                    value={form.year}
                    onChange={(e) => handleChange('year', Number(e.target.value))}
                    className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Mileage</label>
                  <input
                    type="number"
                    min="0"
                    value={form.mileage}
                    onChange={(e) => handleChange('mileage', Number(e.target.value))}
                    className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Vehicle Class *</label>
                <input
                  list="vehicle-categories"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                  placeholder="SUV, Sports, Luxury..."
                  required
                />
                <datalist id="vehicle-categories">
                  {Object.values(CarCategory).map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400 h-28"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Rate Per Day *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.pricePerDay}
                    onChange={(e) => handleChange('pricePerDay', Number(e.target.value))}
                    className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Deposit</label>
                  <input
                    type="number"
                    min="0"
                    value={form.deposit}
                    onChange={(e) => handleChange('deposit', Number(e.target.value))}
                    className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Availability *</label>
                  <select
                    value={form.isAvailable ? 'available' : 'unavailable'}
                    onChange={(e) => handleChange('isAvailable', e.target.value === 'available')}
                    className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={form.seats}
                    onChange={(e) => handleChange('seats', Number(e.target.value))}
                    className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Transmission</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => handleChange('transmission', e.target.value)}
                    className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                  >
                    <option value="">Select</option>
                    {!Object.values(Transmission).includes(form.transmission as Transmission) && form.transmission && (
                      <option value={form.transmission}>{form.transmission}</option>
                    )}
                    {Object.values(Transmission).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Fuel</label>
                  <select
                    value={form.fuelType}
                    onChange={(e) => handleChange('fuelType', e.target.value)}
                    className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                  >
                    <option value="">Select</option>
                    {!Object.values(FuelType).includes(form.fuelType as FuelType) && form.fuelType && (
                      <option value={form.fuelType}>{form.fuelType}</option>
                    )}
                    {Object.values(FuelType).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">MPG / Range</label>
                <input
                  type="text"
                  value={form.mpg}
                  onChange={(e) => handleChange('mpg', e.target.value)}
                  className="mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Images *</h2>
                <p className="text-sm text-gray-400">Upload or paste URLs. First image is used as primary.</p>
              </div>
              <button
                type="button"
                onClick={() => handleAddField('images')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-sm text-white border border-gray-700 hover:border-amber-300 hover:text-amber-300"
              >
                <Plus className="h-4 w-4" /> Add Image
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.images.map((image, idx) => (
                <div key={`${image}-${idx}`} className="border border-gray-800 rounded-lg p-3 bg-gray-950">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={image || FALLBACK_CAR_IMAGE}
                      alt="Vehicle"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_CAR_IMAGE;
                      }}
                      className="h-20 w-28 object-cover rounded-md border border-gray-800"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="https://..."
                        value={image}
                        onChange={(e) => updateArrayField('images', idx, e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2 text-sm text-white focus:border-amber-400 focus:ring-amber-400"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageFile(file, idx);
                        }}
                        className="w-full text-xs text-gray-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveField('images', idx)}
                      className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-300 hover:bg-red-900/30"
                      aria-label="Remove image"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                  {idx === 0 && <p className="text-xs text-amber-300">Primary image</p>}
                </div>
              ))}
              {form.images.length === 0 && (
                <div className="text-sm text-gray-400">Add at least one image to publish updates.</div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Features</h2>
              <button
                type="button"
                onClick={() => handleAddField('features')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg text-sm text-white border border-gray-700 hover:border-amber-300 hover:text-amber-300"
              >
                <Plus className="h-4 w-4" /> Add Feature
              </button>
            </div>
            <div className="space-y-3">
              {form.features.map((feature, idx) => (
                <div key={`${feature}-${idx}`} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateArrayField('features', idx, e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-3 text-white focus:border-amber-400 focus:ring-amber-400"
                    placeholder="e.g. Carbon ceramic brakes"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField('features', idx)}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-300 hover:bg-red-900/30"
                    aria-label="Remove feature"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {form.features.length === 0 && (
                <p className="text-sm text-gray-400">Add bullet points to highlight the vehicle's best features.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-5 py-2 rounded-lg border border-gray-800 text-gray-200 hover:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 flex items-center gap-2 disabled:opacity-70"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
