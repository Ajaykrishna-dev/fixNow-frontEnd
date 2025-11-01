import { reverseGeocode } from './providerServices';

export interface CurrentPosition {
  latitude: number;
  longitude: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export const getBrowserCurrentPosition = (): Promise<CurrentPosition> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (err) => {
        // Provide user-friendly error messages based on error code
        let errorMessage = 'Unable to retrieve your location';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your device settings.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      { 
        enableHighAccuracy: true,  // Use GPS if available
        timeout: 15000,             // Increased to 15 seconds for better accuracy
        maximumAge: 0               // Don't use cached position, always get fresh location
      }
    );
  });
};

export const getCurrentPositionWithAddress = async (): Promise<{ latitude: number; longitude: number; address: string }> => {
  const { latitude, longitude } = await getBrowserCurrentPosition();
  const address = await reverseGeocode(latitude, longitude);
  return { latitude, longitude, address };
};
