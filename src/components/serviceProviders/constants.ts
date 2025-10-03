import { User, MapPin, Shield } from 'lucide-react';
import { ServiceType } from '../../types';
import { StepDefinition } from './types';

export const SERVICE_TYPES: { value: ServiceType; label: string; icon: string }[] = [
  { value: 'plumber', label: 'Plumber', icon: '🔧' },
  { value: 'electrician', label: 'Electrician', icon: '⚡' },
  { value: 'puncture-repair', label: 'Puncture Repair', icon: '🚗' },
  { value: 'carpenter', label: 'Carpenter', icon: '🔨' },
  { value: 'painter', label: 'Painter', icon: '🎨' },
  { value: 'mechanic', label: 'Mechanic', icon: '⚙️' },
  { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { value: 'gardening', label: 'Gardening', icon: '🌱' },
];

export const STEPS: StepDefinition[] = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Service Information', icon: Shield },
  { id: 3, title: 'Location & Availability', icon: MapPin },
];


