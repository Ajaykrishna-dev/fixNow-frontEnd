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