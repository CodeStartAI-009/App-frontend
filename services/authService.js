// services/authService.js
import api from "./api";

export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);

export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const verifyOtp = (data) => api.post("/auth/verify-otp", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);

export const getProfile = () => api.get("/profile/me");

// PATCH update user profile
export const updateProfile = (data) => api.patch("/profile/me", data);
