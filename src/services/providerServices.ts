import axios from "axios";
import API_BASE_URL from "../api/apiConfig.ts";

// Handles all API logic (no UI here)
export const createProvider = async (providerData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/providers/`, providerData);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error; // Let UI layer handle it
  }
};

export const getAllProviders = async () => {
  const response = await axios.get(`${API_BASE_URL}/providers/`);
  return response.data;
}; 

// Reverse geocode coordinates to a human-readable address using OpenStreetMap Nominatim
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return fallback;
    const data = await res.json();
    const human = (data && (data.display_name as string)) || '';
    return human || fallback;
  } catch (_e) {
    return fallback;
  }
}; 