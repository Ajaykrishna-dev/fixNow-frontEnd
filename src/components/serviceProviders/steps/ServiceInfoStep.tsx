import React from 'react';
import { Shield } from 'lucide-react';
import { SERVICE_TYPES } from '../constants';
import { FormErrors, ProviderForm, TouchedFields } from '../types';

interface ServiceInfoStepProps {
  formData: ProviderForm;
  errors: FormErrors;
  touched: TouchedFields;
  loading: boolean;
  updateFormData: (field: keyof ProviderForm, value: any) => void;
}

export const ServiceInfoStep: React.FC<ServiceInfoStepProps> = ({
  formData,
  errors,
  touched,
  loading,
  updateFormData,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Service Information</h2>
        <p className="text-gray-600">Tell us about your services</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Service Types * (Select all that apply)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SERVICE_TYPES.map((service) => (
            <button
              key={service.value}
              type="button"
              onClick={() => {
                const currentTypes = formData.serviceTypes || [];
                const isSelected = currentTypes.includes(service.value);
                const newTypes = isSelected 
                  ? currentTypes.filter(type => type !== service.value)
                  : [...currentTypes, service.value];
                updateFormData('serviceTypes', newTypes);
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                (formData.serviceTypes || []).includes(service.value)
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <div className="text-sm font-medium">{service.label}</div>
            </button>
          ))}
        </div>
        {errors.serviceTypes && touched.serviceTypes && (
          <p className="text-red-500 text-sm mt-2">{errors.serviceTypes}</p>
        )}
        {/* {(formData.serviceTypes || []).length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: {(formData.serviceTypes || []).map(type => 
              SERVICE_TYPES.find(s => s.value === type)?.label
            ).join(', ')}
          </div>
        )} */}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
          <input
            type="text"
            required
            value={formData.businessName}
            onChange={(e) => updateFormData('businessName', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
              errors.businessName && touched.businessName ? 'border-red-500' : ''
            }`}
            placeholder="Your business name"
            disabled={loading}
          />
          {errors.businessName && touched.businessName && (
            <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate (₹) *
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => updateFormData("hourlyRate", Math.max(100, (formData.hourlyRate || 150) - 50))}
              className="px-4 py-3 border border-gray-200 rounded-l-xl bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={loading || (formData.hourlyRate || 0) <= 100}
            >
              <span className="font-bold text-lg">-</span>
            </button>
            <input
              type="text"
              readOnly
              value={`₹ ${formData.hourlyRate || "100"}`}
              className={`w-full text-center font-semibold text-lg text-gray-800 px-4 py-3 border-t border-b border-gray-200 focus:outline-none transition-all duration-200 ${
                errors.hourlyRate && touched.hourlyRate ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => updateFormData("hourlyRate", (formData.hourlyRate || 50) + 50)}
              className="px-4 py-3 border border-gray-200 rounded-r-xl bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <span className="font-bold text-lg">+</span>
            </button>
          </div>
          {/* <input
            type="range"
            min="100"
            max="10000"
            step="50"
            value={formData.hourlyRate || 100}
            onChange={(e) => updateFormData("hourlyRate", parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3 accent-emerald-600"
            disabled={loading}
          /> */}
          {errors.hourlyRate && touched.hourlyRate && (
            <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
            placeholder="Brief description of your services and specialties"
            disabled={loading}
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
          <input
            type="text"
            value={formData.experience}
            onChange={(e) => updateFormData('experience', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
            placeholder="5+ years"
            disabled={loading}
          />
        </div> */}
      </div>
    </div>
  );
};


