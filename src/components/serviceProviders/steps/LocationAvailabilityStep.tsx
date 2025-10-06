import React from 'react';
import { MapPin } from 'lucide-react';
import { FormErrors, ProviderForm, TouchedFields } from '../types';

interface LocationAvailabilityStepProps {
  formData: ProviderForm;
  errors: FormErrors;
  touched: TouchedFields;
  loading: boolean;
  updateFormData: (field: keyof ProviderForm, value: any) => void;
}

export const LocationAvailabilityStep: React.FC<LocationAvailabilityStepProps> = ({
  formData,
  errors,
  touched,
  loading,
  updateFormData,
}) => {
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const date = new Date(0, 0, 0, i, j);
        slots.push(
          date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        );
      }
    }
    return slots;
  }, []);

  const [startTime, endTime] = React.useMemo(() => {
    if (formData.availableHours && formData.availableHours.includes(' - ')) {
      const parts = formData.availableHours.split(' - ');
      if (parts.length === 2) {
        return [parts[0], parts[1]];
      }
    }
    return ['8:00 AM', '6:00 PM']; // Default values
  }, [formData.availableHours]);

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartTime = e.target.value;
    updateFormData('availableHours', `${newStartTime} - ${endTime}`);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndTime = e.target.value;
    updateFormData('availableHours', `${startTime} - ${newEndTime}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Location & Availability</h2>
        <p className="text-gray-600">Where and when do you provide services?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Address *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
              errors.address && touched.address ? 'border-red-500' : ''
            }`}
            placeholder="123 Main St, City, State"
            disabled={loading}
          />
          {errors.address && touched.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Hours *</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <select
                value={startTime}
                onChange={handleStartTimeChange}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
                  errors.availableHours && touched.availableHours ? 'border-red-500' : ''
                }`}
                disabled={loading}
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <select
                value={endTime}
                onChange={handleEndTimeChange}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
                  errors.availableHours && touched.availableHours ? 'border-red-500' : ''
                }`}
                disabled={loading}
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.availableHours && touched.availableHours && (
            <p className="text-red-500 text-sm mt-1">{errors.availableHours}</p>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
          <div>
            <h4 className="font-semibold text-orange-900">Emergency Services</h4>
            <p className="text-sm text-orange-600">Available for urgent calls outside normal hours?</p>
          </div>
          <button
            type="button"
            onClick={() => updateFormData('emergencySupport', !formData.emergencySupport)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.emergencySupport ? 'bg-orange-600' : 'bg-gray-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.emergencySupport ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};