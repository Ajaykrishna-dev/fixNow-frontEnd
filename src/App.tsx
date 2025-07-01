import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ServiceSeeker } from './components/ServiceSeeker';
import { ServiceProvider } from './components/ServiceProvider';

type AppMode = 'landing' | 'seeker' | 'provider';

function App() {
  const [mode, setMode] = useState<AppMode>('landing');

  const handleModeSelect = (selectedMode: 'seeker' | 'provider') => {
    setMode(selectedMode);
  };

  const handleBackToLanding = () => {
    setMode('landing');
  };

  return (
    <>
      {mode === 'landing' && <LandingPage onSelectMode={handleModeSelect} />}
      {mode === 'seeker' && <ServiceSeeker onBack={handleBackToLanding} />}
      {mode === 'provider' && <ServiceProvider onBack={handleBackToLanding} />}
    </>
  );
}

export default App;