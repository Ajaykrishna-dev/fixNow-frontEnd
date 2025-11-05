import React, { useEffect }from 'react';
import { useState } from 'react';
import { LandingPage } from './components/home/LandingPage';
import { LoginModal } from './components/serviceProviders/loginModal';
import { ProviderDashboard } from './components/serviceProviders/providerDashboard';
import { authService } from './services/auth';
import { LoginResponse, User } from './types';

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
  const [currentView, setCurrentView] = useState<'landing' | 'seeker' | 'provider' | 'dashboard'>(() => {
    const savedView = sessionStorage.getItem('currentView');
    return savedView ? JSON.parse(savedView) : 'landing';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInProvider, setLoggedInProvider] = useState<typeof mockProviderData | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  // Check authentication state on mount
  useEffect(() => {
    const authState = authService.getAuthState();
    if (authState.isAuthenticated && authState.user) {
      setAuthenticatedUser(authState.user);
      
      // Navigate to dashboard based on user role
      if (authState.user.role === 'service_providers') {
        setCurrentView('dashboard');
        // In a real app, you would fetch provider data from API
        // For now, using mock data
        setLoggedInProvider(mockProviderData);
      } else if (authState.user.role === 'service_seeker') {
        // Navigate to seeker view
        setCurrentView('seeker');
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('currentView', JSON.stringify(currentView));
  }, [currentView]);

  const handleSelectMode = (mode: 'seeker' | 'provider' | 'landing') => {
    setCurrentView(mode);
  };

  const handleProviderLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogin = (loginResponse: LoginResponse) => {
    // Auth data is already stored by LoginModal component
    setAuthenticatedUser(loginResponse.user);
    
    // Navigate based on user role
    if (loginResponse.user.role === 'service_providers') {
      setCurrentView('dashboard');
      // In a real app, fetch provider data from API using the user ID
      // For now, using mock data
      setLoggedInProvider(mockProviderData);
    } else if (loginResponse.user.role === 'service_seeker') {
      setCurrentView('seeker');
    }
    
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    // Clear authentication data
    authService.clearAuth();
    setAuthenticatedUser(null);
    setLoggedInProvider(null);
    setCurrentView('landing');
  };

  // Show dashboard if authenticated as service provider
  if (currentView === 'dashboard' && loggedInProvider && authenticatedUser?.role === 'service_providers') {
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
