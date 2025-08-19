import React from 'react';
import { useState } from 'react';
import { LandingPage } from './components/home/LandingPage';
import { LoginModal } from './components/serviceProviders/loginModal';
import { ProviderDashboard } from './components/serviceProviders/providerDashboard';

// Mock provider data - in a real app, this would come from an API
const mockProviderData = {
  name: 'John Smith',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  services: ['Plumbing', 'Electrical', 'HVAC'],
  experience: '8 years',
  rating: 4.8,
  completedJobs: 247,
  availability: 'Mon-Fri 8AM-6PM',
  description: 'Experienced professional with expertise in residential and commercial repairs. Licensed and insured with a commitment to quality workmanship and customer satisfaction.',
  joinedDate: 'Jan 2020'
};

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'seeker' | 'provider' | 'dashboard'>('landing');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInProvider, setLoggedInProvider] = useState<typeof mockProviderData | null>(null);

  const handleSelectMode = (mode: 'seeker' | 'provider') => {
    setCurrentView(mode);
  };

  const handleProviderLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogin = (credentials: { email: string; password: string }) => {
    // In a real app, you would validate credentials with an API
    if (credentials.email === 'john@example.com' && credentials.password === 'password123') {
      setLoggedInProvider(mockProviderData);
      setCurrentView('dashboard');
      setShowLoginModal(false);
    } else {
      alert('Invalid credentials. Please use the demo credentials provided.');
    }
  };

  const handleLogout = () => {
    setLoggedInProvider(null);
    setCurrentView('landing');
  };

  if (currentView === 'dashboard' && loggedInProvider) {
    return <ProviderDashboard provider={loggedInProvider} onLogout={handleLogout} />;
  }

  return (
    <>
      <LandingPage 
        currentView={currentView}
        onSelectMode={handleSelectMode} 
        onProviderLogin={handleProviderLogin}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
}

export default App;
