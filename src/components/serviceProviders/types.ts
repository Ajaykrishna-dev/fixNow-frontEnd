import { ServiceType } from '../../types';

export interface ServiceProviderProps {
  onBack: () => void;
}

export interface ProviderForm {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  serviceTypes: ServiceType[];
  businessName: string;
  address: string;
  availableHours: string;
  emergencySupport: boolean;
  hourlyRate: number;
  description: string;
  experience: string;
}

export interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  serviceTypes?: string;
  address?: string;
  availableHours?: string;
  hourlyRate?: string;
}

export interface TouchedFields {
  fullName: boolean;
  phoneNumber: boolean;
  email: boolean;
  password: boolean;
  serviceTypes: boolean;
  address: boolean;
  availableHours: boolean;
  hourlyRate: boolean;
}

export interface StepDefinition {
  id: number;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}


