import React from 'react';
import { MapPin, Crosshair } from 'lucide-react';
import { FormErrors, ProviderForm, TouchedFields } from '../types';
// Map
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode as reverseGeocodeService } from '../../../services/providerServices';

// Fix default Leaflet marker icons under bundlers (Vite)
// Only run in browser
if (typeof window !== 'undefined') {
  // @ts-ignore - accessing private property to reset
  delete (L.Icon.Default as any).prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
  });
}

interface LocationAvailabilityStepProps {
  formData: ProviderForm;
  errors: FormErrors;
  touched: TouchedFields;
  loading: boolean;
  updateFormData: (field: keyof ProviderForm, value: any) => void;
}

export const LocationAvailabilityStep: React.FC<LocationAvailabilityStepProps> = ({
  formData,
  errors,
  touched,
  loading,
  updateFormData,
}) => {
  const [isLocating, setIsLocating] = React.useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = React.useState(false);
  const [map, setMap] = React.useState<L.Map | null>(null);

  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const date = new Date(0, 0, 0, i, j);
        slots.push(
          date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        );
      }
    }
    return slots;
  }, []);

  const [startTime, endTime] = React.useMemo(() => {
    if (formData.availableHours && formData.availableHours.includes(' - ')) {
      const parts = formData.availableHours.split(' - ');
      if (parts.length === 2) {
        return [parts[0], parts[1]];
      }
    }
    return ['8:00 AM', '6:00 PM']; // Default values
  }, [formData.availableHours]);

  // Reverse geocode via service
  const reverseGeocode = React.useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    const addr = await reverseGeocodeService(lat, lng);
    updateFormData('address', addr);
    setIsReverseGeocoding(false);
  }, [updateFormData]);

  const handleSetPosition = React.useCallback((lat: number, lng: number, shouldReverse = true) => {
    updateFormData('latitude' as keyof ProviderForm, lat);
    updateFormData('longitude' as keyof ProviderForm, lng);
    if (shouldReverse) reverseGeocode(lat, lng);
  }, [reverseGeocode, updateFormData]);

  const getCurrentLocation = async () => {
    if (map) {
      setIsLocating(true);
      map.locate();
    }
  };

  // Map click handler component
  const ClickHandler: React.FC = () => {
    const map = useMap();
    React.useEffect(() => {
      if (map) {
        setMap(map);
      }
    }, [map]);

    useMapEvents({
      click: (e) => {
        handleSetPosition(e.latlng.lat, e.latlng.lng, true);
      },
      locationfound: (e) => {
        handleSetPosition(e.latlng.lat, e.latlng.lng, true);
        map.flyTo(e.latlng, 13);
        setIsLocating(false);
      },
      locationerror: () => {
        setIsLocating(false);
        // You might want to show an error to the user here
      }
    });
    return null;
  };

  const hasPosition = Boolean(formData.latitude && formData.longitude);
  const keralaCenter: [number, number] = [10.8505, 76.2711]; // Kerala centroid approx
  const centerPosition: [number, number] = React.useMemo(() => {
    if (hasPosition) return [formData.latitude, formData.longitude];
    // Default center (Kerala)
    return keralaCenter;
  }, [hasPosition, formData.latitude, formData.longitude]);
  const zoomLevel = hasPosition ? 13 : 8;

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartTime = e.target.value;
    updateFormData('availableHours', `${newStartTime} - ${endTime}`);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEndTime = e.target.value;
    updateFormData('availableHours', `${startTime} - ${newEndTime}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Location & Availability</h2>
        <p className="text-gray-600">Where and when do you provide services?</p>
      </div>

      <div className="space-y-6">
        {/* Map + Controls */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Pick Location on Map</label>
            <button
              type="button"
              onClick={getCurrentLocation}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${isLocating ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading || isLocating}
              title="Use current location"
            >
              <Crosshair className="h-4 w-4" />
              {isLocating ? 'Locating...' : 'Use current location'}
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <MapContainer center={centerPosition} zoom={zoomLevel} style={{ height: 320, width: '100%' }} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickHandler />
              {formData.latitude && formData.longitude ? (
                <Marker position={[formData.latitude, formData.longitude]} />
              ) : null}
            </MapContainer>
          </div>
          {/* <div className="mt-2 text-sm text-gray-600">
            {formData.latitude && formData.longitude ? (
              <span>Lat: {formData.latitude.toFixed(6)}, Lng: {formData.longitude.toFixed(6)} {isReverseGeocoding ? '(resolving address...)' : ''}</span>
            ) : (
              <span>Click on the map or use your current location.</span>
            )}
          </div> */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Address *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
              errors.address && touched.address ? 'border-red-500' : ''
            }`}
            placeholder="123 Main St, City, State"
            disabled={loading}
          />
          {errors.address && touched.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Hours *</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <select
                value={startTime}
                onChange={handleStartTimeChange}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
                  errors.availableHours && touched.availableHours ? 'border-red-500' : ''
                }`}
                disabled={loading}
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <select
                value={endTime}
                onChange={handleEndTimeChange}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 ${
                  errors.availableHours && touched.availableHours ? 'border-red-500' : ''
                }`}
                disabled={loading}
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.availableHours && touched.availableHours && (
            <p className="text-red-500 text-sm mt-1">{errors.availableHours}</p>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
          <div>
            <h4 className="font-semibold text-orange-900">Emergency Services</h4>
            <p className="text-sm text-orange-600">Available for urgent calls outside normal hours?</p>
          </div>
          <button
            type="button"
            onClick={() => updateFormData('emergencySupport', !formData.emergencySupport)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.emergencySupport ? 'bg-orange-600' : 'bg-gray-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.emergencySupport ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};