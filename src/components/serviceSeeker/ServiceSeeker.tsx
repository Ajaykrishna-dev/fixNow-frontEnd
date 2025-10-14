import React, { useState } from 'react';
import { ServiceProvider, ServiceRequest } from '../../types';
import { SearchView } from './SearchView';
import { ResultsView } from './ResultsView';

interface ServiceSeekerProps {
  onBack: () => void;
}

const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    fullName: 'John Smith',
    phoneNumber: '+1234567890',
    serviceType: 'plumber',
    businessName: 'Smith Plumbing Services',
    address: '123 Main St, Downtown',
    latitude: 40.7128,
    longitude: -74.0060,
    availableHours: '8:00 AM - 8:00 PM',
    emergencySupport: true,
    hourlyRate: 75,
    rating: 4.8,
    reviewCount: 127,
    isAvailable: true,
    distance: 0.5,
  },
  {
    id: '2',
    fullName: 'Mike Johnson',
    phoneNumber: '+1234567891',
    serviceType: 'electrician',
    businessName: 'Power Pro Electric',
    address: '456 Oak Ave, Midtown',
    latitude: 40.7580,
    longitude: -73.9855,
    availableHours: '7:00 AM - 10:00 PM',
    emergencySupport: true,
    hourlyRate: 85,
    rating: 4.9,
    reviewCount: 89,
    isAvailable: true,
    distance: 1.2,
  },
  {
    id: '3',
    fullName: 'Sarah Williams',
    phoneNumber: '+1234567892',
    serviceType: 'puncture-repair',
    businessName: 'Quick Fix Mobile',
    address: 'Mobile Service',
    latitude: 40.7489,
    longitude: -73.9857,
    availableHours: '24/7',
    emergencySupport: true,
    hourlyRate: 50,
    rating: 4.7,
    reviewCount: 203,
    isAvailable: true,
    distance: 2.1,
  },
];

export const ServiceSeeker: React.FC<ServiceSeekerProps> = ({ onBack }) => {
  const [step, setStep] = useState<'search' | 'results'>('search');
  const [searchRequest, setSearchRequest] = useState<ServiceRequest>({
    serviceType: '',
    radius: 5,
    isEmergency: false,
    location: { latitude: 0, longitude: 0 },
  });
  const [providers, setProviders] = useState<ServiceProvider[]>([]);

  const handleSearch = () => {
    const filteredProviders = mockProviders.filter(provider =>
      provider.serviceType === searchRequest.serviceType &&
      (!searchRequest.isEmergency || provider.emergencySupport) &&
      provider.isAvailable
    );
    setProviders(filteredProviders);
    setStep('results');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchRequest(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {step === 'results' ? (
        <ResultsView
          providers={providers}
          serviceTypeLabel={''}
          onBackToSearch={() => setStep('search')}
        />
      ) : (
        <SearchView
          onBack={onBack}
          searchRequest={searchRequest}
          setServiceType={(type) => setSearchRequest(prev => ({ ...prev, serviceType: type }))}
          setRadius={(km) => setSearchRequest(prev => ({ ...prev, radius: km }))}
          toggleEmergency={() => setSearchRequest(prev => ({ ...prev, isEmergency: !prev.isEmergency }))}
          useCurrentLocation={getCurrentLocation}
          onSearch={handleSearch}
        />
      )}
    </div>
  );
};