import React from 'react';
import { User } from 'lucide-react';
import { FormErrors, ProviderForm, TouchedFields } from '../types';

interface PersonalInfoStepProps {
  formData: ProviderForm;
  errors: FormErrors;
  touched: TouchedFields;
  loading: boolean;
  updateFormData: (field: keyof ProviderForm, value: any) => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
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
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
              errors.fullName && touched.fullName ? 'border-red-500' : ''
            }`}
            placeholder="Enter your full name"
            disabled={loading}
          />
          {errors.fullName && touched.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            required
            value={formData.phoneNumber}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
              errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : ''
            }`}
            placeholder="+1 (555) 123-4567"
            disabled={loading}
          />
          {errors.phoneNumber && touched.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
              errors.email && touched.email ? 'border-red-500' : ''
            }`}
            placeholder="example@email.com"
            disabled={loading}
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
              errors.password && touched.password ? 'border-red-500' : ''
            }`}
            placeholder="Enter a secure password"
            disabled={loading}
          />
          {errors.password && touched.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
          <input
            type="password"
            required
            value={formData.confirmPassword || ''}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
              errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''
            }`}
            placeholder="Confirm your password"
            disabled={loading}
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
};


