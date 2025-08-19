import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, MapPin, Shield, Check } from 'lucide-react';
import { ServiceType } from '../../types';
import { createProvider } from '../../services/providerServices';

interface ServiceProviderProps {
  onBack: () => void;
}

const serviceTypes: { value: ServiceType; label: string; icon: string }[] = [
  { value: 'plumber', label: 'Plumber', icon: '🔧' },
  { value: 'electrician', label: 'Electrician', icon: '⚡' },
  { value: 'puncture-repair', label: 'Puncture Repair', icon: '🚗' },
  { value: 'carpenter', label: 'Carpenter', icon: '🔨' },
  { value: 'painter', label: 'Painter', icon: '🎨' },
  { value: 'mechanic', label: 'Mechanic', icon: '⚙️' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { value: 'gardening', label: 'Gardening', icon: '🌱' },
];

interface ProviderForm {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  serviceType: ServiceType | '';
  businessName: string;
  address: string;
  availableHours: string;
  emergencySupport: boolean;
  hourlyRate: number;
  description: string;
  experience: string;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  serviceType?: string;
  address?: string;
  availableHours?: string;
  hourlyRate?: string;
}

interface TouchedFields {
  fullName: boolean;
  phoneNumber: boolean;
  email: boolean;
  password: boolean;
  serviceType: boolean;
  address: boolean;
  availableHours: boolean;
  hourlyRate: boolean;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ onBack }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState<ProviderForm>({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    serviceType: '',
    businessName: '',
    address: '',
    availableHours: '',
    emergencySupport: false,
    hourlyRate: 0,
    description: '',
    experience: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({
    fullName: false,
    phoneNumber: false,
    email: false,
    password: false,
    serviceType: false,
    address: false,
    availableHours: false,
    hourlyRate: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (touched.fullName && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (touched.fullName && formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (touched.fullName && !/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Full name should only contain letters and spaces';
    }

    if (touched.phoneNumber && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (touched.phoneNumber && !/^\+?[\d\s()-]{10,14}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid phone number (e.g., +1234567890 or (123) 456-7890)';
    }

    if (touched.email && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (touched.password && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (touched.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (touched.serviceType && !formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    if (touched.address && !formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (touched.address && formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    if (touched.availableHours && !formData.availableHours.trim()) {
      newErrors.availableHours = 'Available hours are required';
    } else if (
      touched.availableHours &&
      !/^\d{1,2}:\d{2}\s*(AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)$/i.test(formData.availableHours)
    ) {
      newErrors.availableHours = 'Enter valid hours (e.g., 8:00 AM - 6:00 PM)';
    }

    if (touched.hourlyRate && formData.hourlyRate <= 0) {
      newErrors.hourlyRate = 'Hourly rate must be greater than 0';
    } else if (touched.hourlyRate && formData.hourlyRate > 1000) {
      newErrors.hourlyRate = 'Hourly rate cannot exceed 1000';
    }

    setErrors(newErrors);

    // Check if all required fields are filled and valid
    const isValid =
      formData.fullName.trim().length >= 2 &&
      /^[a-zA-Z\s]+$/.test(formData.fullName) &&
      /^\+?[\d\s()-]{10,14}$/.test(formData.phoneNumber) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.trim().length >= 8 &&
      formData.serviceType !== '' &&
      formData.address.trim().length >= 5 &&
      /^\d{1,2}:\d{2}\s*(AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)$/i.test(formData.availableHours) &&
      formData.hourlyRate > 0 &&
      formData.hourlyRate <= 1000;

    return isValid;
  };

  // Update form validity whenever formData or touched fields change
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched on submit to show all errors
    setTouched({
      fullName: true,
      phoneNumber: true,
      email: true,
      password: true,
      serviceType: true,
      address: true,
      availableHours: true,
      hourlyRate: true,
    });

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      await createProvider(formData);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof ProviderForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Welcome to FixNow! Your profile is now active and customers in your area can find and contact you.
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              disabled={loading}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join as a Service Provider</h2>
            <p className="text-gray-600">Create your profile and start connecting with customers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-emerald-600" />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
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
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                Service Information
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.value}
                      type="button"
                      onClick={() => updateFormData('serviceType', service.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.serviceType === service.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                    >
                      <div className="text-lg mb-1">{service.icon}</div>
                      <div className="text-sm font-medium">{service.label}</div>
                    </button>
                  ))}
                </div>
                {errors.serviceType && touched.serviceType && (
                  <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                    placeholder="Optional business name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => updateFormData('hourlyRate', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
                      errors.hourlyRate && touched.hourlyRate ? 'border-red-500' : ''
                    }`}
                    placeholder="75"
                    disabled={loading}
                  />
                  {errors.hourlyRate && touched.hourlyRate && (
                    <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Availability */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                Location & Availability
              </h3>
              
              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Hours *</label>
                <input
                  type="text"
                  required
                  value={formData.availableHours}
                  onChange={(e) => updateFormData('availableHours', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
                    errors.availableHours && touched.availableHours ? 'border-red-500' : ''
                  }`}
                  placeholder="8:00 AM - 6:00 PM"
                  disabled={loading}
                />
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

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              
              <div className="mb-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  placeholder="5+ years"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            {error && (
              <div className="text-red-600 bg-red-50 rounded-xl p-4 text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 ${
                (!isFormValid || loading) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isFormValid || loading}
            >
              {loading ? 'Creating...' : 'Create Provider Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};