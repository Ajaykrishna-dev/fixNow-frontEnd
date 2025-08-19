import React from 'react';
import { Search, Wrench, MapPin, Clock, Phone, LogIn } from 'lucide-react';
import { ServiceProvider } from '../serviceProviders/ServiceProvider';

interface LandingPageProps {
  onSelectMode: (mode: 'seeker' | 'provider') => void;
  onProviderLogin: () => void;
  currentView: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectMode, onProviderLogin, currentView }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                FixNow
              </h1>
            </div>
            
            {/* Login Button */}
            <button
              onClick={onProviderLogin}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
            >
              <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Provider Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {currentView === 'provider' ? (
       <ServiceProvider onBack={() => onSelectMode('seeker')} />
      ) : (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Local Services
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              Instantly
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with trusted local service providers in your area. From emergency repairs to routine maintenance, 
            get the help you need when you need it.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Need Service Card */}
          <div 
            onClick={() => onSelectMode('seeker')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Service?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Find qualified service providers near you. Search by service type, location, and availability.
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold group-hover:shadow-lg transition-all duration-300">
                  Find Services
                </div>
              </div>
            </div>
          </div>

          {/* Provide Service Card */}
          <div 
            onClick={() => onSelectMode('provider')}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-emerald-200">
              <div className="text-center">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Provide Services?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Join our network of trusted professionals. Get connected with customers in your area.
                </p>
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold group-hover:shadow-lg transition-all duration-300">
                  Join as Provider
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Location-Based</h3>
            <p className="text-gray-600">Find services closest to your location for faster response times.</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Emergency</h3>
            <p className="text-gray-600">Emergency services available around the clock when you need them most.</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Contact</h3>
            <p className="text-gray-600">Connect directly with service providers via phone or messaging.</p>
          </div>
        </div>
      </main>)}
    </div>
  );
};