// services/api.js
import axios from "axios";

// Local backend (Expo local dev)
const LOCAL_URL = "http://localhost:5059/api";

// Your deployed backend
const PROD_URL = "https://app-backend-psi.vercel.app/api";

// Expo treats NODE_ENV differently → safely detect
const isDev =
  typeof process !== "undefined" &&
  process.env.NODE_ENV === "development";

// Final Base URL
const API_BASE_URL = isDev ? LOCAL_URL : PROD_URL;

console.log("🔗 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach JWT token from globalThis.authToken
api.interceptors.request.use(
  (config) => {
    const token = globalThis.authToken;

    if (token) {
      console.log("🔐 Attaching token:", token.slice(0, 20) + "..."); // show partial
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("⚠️ No token found in globalThis.authToken");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
