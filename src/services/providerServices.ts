import axiosInstance from "../api/axiosConfig.ts";
import API_BASE_URL from "../api/apiConfig.ts";
import { LoginResponse } from "../types/index.ts";
import axios from "axios";

// Handles all API logic (no UI here)

// Authentication endpoint (use plain axios, not interceptor instance, to avoid circular dependency)
export const login = async (
  email: string, 
  password: string, 
  role: 'service_seeker' | 'service_providers'
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
      email,
      password,
      role
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error; // Let UI layer handle it
  }
};

export const createProvider = async (providerData: any) => {
  try {
    // Use axiosInstance which has interceptors for authenticated requests
    const response = await axiosInstance.post(`${API_BASE_URL}/providers/`, providerData);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error; // Let UI layer handle it
  }
};

export const getAllProviders = async () => {
  // Use axiosInstance which has interceptors for authenticated requests
  const response = await axiosInstance.get(`${API_BASE_URL}/providers/`);
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