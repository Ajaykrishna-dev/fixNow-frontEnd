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