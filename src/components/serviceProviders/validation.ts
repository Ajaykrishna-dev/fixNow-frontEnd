import { FormErrors, ProviderForm, TouchedFields } from './types';

export const validateForm = (
  formData: ProviderForm,
  touched: TouchedFields,
  setErrors?: (errors: FormErrors) => void,
): boolean => {
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

  if (setErrors) {
    setErrors(newErrors);
  }

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

export const validateStep = (step: number, formData: ProviderForm): boolean => {
  if (step === 1) {
    return (
      formData.fullName.trim().length >= 2 &&
      /^[a-zA-Z\s]+$/.test(formData.fullName) &&
      /^\+?[\d\s()-]{10,14}$/.test(formData.phoneNumber) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.trim().length >= 8
    );
  }
  if (step === 2) {
    return formData.serviceType !== '' && formData.hourlyRate > 0 && formData.hourlyRate <= 1000;
  }
  if (step === 3) {
    return (
      formData.address.trim().length >= 5 &&
      /^\d{1,2}:\d{2}\s*(AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)$/i.test(formData.availableHours)
    );
  }
  return false;
};


