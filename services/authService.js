// services/authService.js
import api from "./api";

// AUTH
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);

// PASSWORD FLOW
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const verifyOtp = (data) => api.post("/auth/verify-otp", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);

// PROFILE
export const getProfile = () => api.get("/profile/me");
export const updateProfile = (data) => api.patch("/profile/me", data);
