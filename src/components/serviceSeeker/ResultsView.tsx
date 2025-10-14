import React from 'react';
import { ArrowLeft, MapPin, Clock, Star, Phone } from 'lucide-react';
import { ServiceProvider } from '../../types';

interface ResultsViewProps {
  providers: ServiceProvider[];
  serviceTypeLabel?: string;
  onBackToSearch: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ providers, serviceTypeLabel, onBackToSearch }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={onBackToSearch}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Search
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Providers</h2>
        <p className="text-gray-600">Found {providers.length} services near you</p>
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
                    {provider.distance !== undefined && (
                      <span className="ml-2 text-blue-600 font-medium">
                        ({provider.distance} km away)
                      </span>
                    )}
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
                    {'$'}{provider.hourlyRate}/hour
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
  );
};
