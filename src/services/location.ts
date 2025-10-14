import { reverseGeocode } from './providerServices';

export interface CurrentPosition {
  latitude: number;
  longitude: number;
}

export const getBrowserCurrentPosition = (): Promise<CurrentPosition> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Geolocation not available'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

export const getCurrentPositionWithAddress = async (): Promise<{ latitude: number; longitude: number; address: string }> => {
  const { latitude, longitude } = await getBrowserCurrentPosition();
  const address = await reverseGeocode(latitude, longitude);
  return { latitude, longitude, address };
};
