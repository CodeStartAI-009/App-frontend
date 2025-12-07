// services/api.js
import axios from "axios";
import { Platform } from "react-native";

const LOCAL_URL = "http://localhost:5059/api";         // iOS sim & Web
const LOCAL_ANDROID = "https://app-backend-psi.vercel.app/api";      // Android emulator
const PROD_URL = "http://localhost:5059/api";

// ✅ Detect correct environment
let API_BASE_URL;

// If running in Expo Go on device/emulator
if (Platform.OS === "android") {
  API_BASE_URL = LOCAL_ANDROID;
} else if (Platform.OS === "ios") {
  API_BASE_URL = LOCAL_URL;
} else {
  // Web or Production Build
  API_BASE_URL = PROD_URL;
}

console.log("🔗 API Base URL:", API_BASE_URL);

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = globalThis.authToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("⚠️ No token found in globalThis.authToken");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
