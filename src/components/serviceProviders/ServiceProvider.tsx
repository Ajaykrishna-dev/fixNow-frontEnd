import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { createProvider } from '../../services/providerServices';
import { ProviderForm, FormErrors, TouchedFields, ServiceProviderProps } from './types';
import { STEPS } from './constants';
import { validateForm as runValidation, validateStep as validateStepData } from './validation';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ServiceInfoStep } from './steps/ServiceInfoStep';
import { LocationAvailabilityStep } from './steps/LocationAvailabilityStep';
import { SuccessState } from './SuccessState';

// Types, constants, and steps are imported from local modules

export const ServiceProvider: React.FC<ServiceProviderProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState<ProviderForm>({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    serviceTypes: [],
    businessName: '',
    address: '',
    latitude: 0,
    longitude: 0,
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
    confirmPassword: false,
    serviceTypes: false,
    businessName: false,
    address: false,
    availableHours: false,
    hourlyRate: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Delegate validation to shared module
  const validateForm = () => runValidation(formData, touched, setErrors);

  // Update form validity whenever formData or touched fields change - keeping your original logic
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData, touched]);

  // Your original handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched on submit to show all errors
    setTouched({
      fullName: true,
      phoneNumber: true,
      email: true,
      password: true,
      confirmPassword: true,
      serviceTypes: true,
      businessName: true,
      address: true,
      availableHours: true,
      hourlyRate: true,
    });

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      console.log(formData);
      const dataToSubmit = { ...formData, role: 'service_providers' };
      await createProvider(dataToSubmit);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Your original updateFormData function
  const updateFormData = (field: keyof ProviderForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Step-level validation
  const validateStep = (step: number) => validateStepData(step, formData);

  const handleNext = () => {
    // Mark current step fields as touched
    if (currentStep === 1) {
      setTouched(prev => ({
        ...prev,
        fullName: true,
        phoneNumber: true,
        email: true,
        password: true,
        confirmPassword: true,
      }));
    } else if (currentStep === 2) {
      setTouched(prev => ({
        ...prev,
        serviceTypes: true,
        businessName: true,
        hourlyRate: true,
      }));
    } else if (currentStep === 3) {
      setTouched(prev => ({
        ...prev,
        address: true,
        availableHours: true,
      }));
    }

    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Create a fake form event for handleSubmit
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSubmit(fakeEvent);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (step === 'success') {
    return <SuccessState onBack={onBack} loading={loading} />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            errors={errors}
            touched={touched}
            loading={loading}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <ServiceInfoStep
            formData={formData}
            errors={errors}
            touched={touched}
            loading={loading}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <LocationAvailabilityStep
            formData={formData}
            errors={errors}
            touched={touched}
            loading={loading}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={currentStep === 1 ? onBack : handlePrevious}
            className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {currentStep === 1 ? 'Back to Home' : 'Previous'}
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of 3
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  currentStep >= step.id 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  currentStep >= step.id ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="flex mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className={`h-2 rounded-full transition-colors ${
                  currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                }`} />
                {index < STEPS.length - 1 && <div className="w-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          {renderStepContent()}

          {/* Error Display */}
          {error && (
            <div className="mt-6 text-red-600 bg-red-50 rounded-xl p-4 text-center">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Previous
                </button>
              )}
            </div>
            <button
              onClick={handleNext}
              className={`px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold flex items-center hover:shadow-lg transition-all duration-200 ${
                (currentStep === 3 ? (!isFormValid || loading) : (!validateStep(currentStep) || loading)) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentStep === 3 ? (!isFormValid || loading) : (!validateStep(currentStep) || loading)}
            >
              {loading ? (
                'Creating...'
              ) : currentStep === 3 ? (
                'Create Provider Profile'
              ) : (
                <>
                  Next
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};