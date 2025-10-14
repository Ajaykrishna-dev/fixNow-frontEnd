import React from 'react';
import { ArrowLeft, Navigation, Search } from 'lucide-react';
import { ServiceRequest, ServiceType } from '../../types';
import { serviceTypes } from './constants';
import { getCurrentPositionWithAddress } from '../../services/location';

interface SearchViewProps {
  onBack: () => void;
  searchRequest: ServiceRequest;
  setServiceType: (type: ServiceType) => void;
  setRadius: (km: number) => void;
  toggleEmergency: () => void;
  useCurrentLocation: () => void;
  onSearch: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  onBack,
  searchRequest,
  setServiceType,
  setRadius,
  toggleEmergency,
  useCurrentLocation,
  onSearch,
}) => {
  const [locStatus, setLocStatus] = React.useState<
    { loading: boolean; address?: string; error?: string }
  >({ loading: false });

  const handleUseCurrentLocation = async () => {
    setLocStatus({ loading: true });
    try {
      const { address } = await getCurrentPositionWithAddress();
      // Update parent via provided callbacks
      setRadius(searchRequest.radius); // no change, just keep existing
      // Let parent know the coords
      useCurrentLocation(); // still call parent for any extra effects
      setLocStatus({ loading: false, address });
    } catch (e: any) {
      setLocStatus({ loading: false, error: 'Unable to fetch location' });
    }
  };
  return (
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What service do you need?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceTypes.map((service) => (
                <button
                  key={service.value}
                  onClick={() => setServiceType(service.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    searchRequest.serviceType === service.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <div className="font-medium">{service.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Location
            </label>
            <button
              onClick={handleUseCurrentLocation}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 flex items-center"
            >
              <Navigation className="h-5 w-5 text-blue-500 mr-3" />
              <span className="text-gray-700">{locStatus.loading ? 'Locating...' : 'Use Current Location'}</span>
            </button>
            {(locStatus.address || locStatus.error) && (
              <div className="mt-2 text-sm text-gray-600">
                {locStatus.address ? (
                  <span>{locStatus.address}</span>
                ) : (
                  <span className="text-red-600">{locStatus.error}</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Search Radius: {searchRequest.radius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={searchRequest.radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
            <div>
              <h3 className="font-semibold text-red-900">Emergency Service</h3>
              <p className="text-sm text-red-600">Need immediate assistance?</p>
            </div>
            <button
              onClick={toggleEmergency}
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

          <button
            onClick={onSearch}
            disabled={!searchRequest.serviceType}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find Service Providers
          </button>
        </div>
      </div>
    </div>
  );
};
