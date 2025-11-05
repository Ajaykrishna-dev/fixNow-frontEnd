export interface ServiceProvider {
  id: string;
  fullName: string;
  phoneNumber: string;
  serviceType: string;
  businessName?: string;
  address: string;
  latitude: number;
  longitude: number;
  availableHours: string;
  emergencySupport: boolean;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  profilePicture?: string;
  isAvailable: boolean;
  distance?: number;
}

export interface ServiceRequest {
  serviceTypes: string[];
  radius: number;
  isEmergency: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
}

export type ServiceType = 
  | 'plumber'
  | 'electrician'
  | 'puncture-repair'
  | 'carpenter'
  | 'painter'
  | 'mechanic'
  | 'cleaning'
  | 'gardening';

export type AvailabilityStatus = 'available' | 'busy' | 'offline';

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'service_seeker' | 'service_providers';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}