import React from 'react';
import { Check } from 'lucide-react';
import { ServiceProviderProps } from './types';

interface SuccessStateProps extends ServiceProviderProps {
  loading: boolean;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ onBack, loading }) => {
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
};


