import React, { useState } from 'react';
import { Search, MapPin, Clock, Star, Phone, ArrowLeft, Navigation } from 'lucide-react';
import { ServiceProvider, ServiceRequest, ServiceType } from '../types';

interface ServiceSeekerProps {
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

// Mock data for demonstration
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
    // Filter mock providers based on search criteria
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

  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => setStep('search')}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Search
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Providers</h2>
            <p className="text-gray-600">
              Found {providers.length} {searchRequest.serviceType} services near you
            </p>
          </div>

          <div className="space-y-6">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">
                          {provider.fullName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{provider.fullName}</h3>
                        {provider.businessName && (
                          <p className="text-gray-600">{provider.businessName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{provider.address}</span>
                        <span className="ml-2 text-blue-600 font-medium">
                          ({provider.distance} km away)
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{provider.availableHours}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{provider.rating}</span>
                        <span className="text-gray-500 ml-1">({provider.reviewCount} reviews)</span>
                      </div>
                      <div className="text-lg font-bold text-emerald-600">
                        ${provider.hourlyRate}/hour
                      </div>
                      {provider.emergencySupport && (
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          Emergency Available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 md:ml-6">
                    <a
                      href={`tel:${provider.phoneNumber}`}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                    <button className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-gray-300 transition-all duration-300">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Find a Service</h2>
            <p className="text-gray-600">Tell us what you need and we'll find the best providers near you</p>
          </div>

          <div className="space-y-6">
            {/* Service Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What service do you need?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceTypes.map((service) => (
                  <button
                    key={service.value}
                    onClick={() => setSearchRequest(prev => ({ ...prev, serviceType: service.value }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      searchRequest.serviceType === service.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <div className="font-medium">{service.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Location
              </label>
              <button
                onClick={getCurrentLocation}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 flex items-center"
              >
                <Navigation className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-gray-700">Use Current Location</span>
              </button>
            </div>

            {/* Search Radius */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Search Radius: {searchRequest.radius} km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={searchRequest.radius}
                onChange={(e) => setSearchRequest(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Emergency Toggle */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-red-900">Emergency Service</h3>
                <p className="text-sm text-red-600">Need immediate assistance?</p>
              </div>
              <button
                onClick={() => setSearchRequest(prev => ({ ...prev, isEmergency: !prev.isEmergency }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  searchRequest.isEmergency ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    searchRequest.isEmergency ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!searchRequest.serviceType}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Find Service Providers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};