// services/api.js
import axios from "axios";

export const API_BASE_URL = "https://app-backend-psi.vercel.app/api";

console.log("🔗 API BASE URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  try {
    const token = globalThis.authToken; // or SecureStore if you use it
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

export default api;
