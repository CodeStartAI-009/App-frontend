// services/authServices.js
import api from "./api";

// SIGNUP
export const signup = (data) => api.post("/auth/signup", data);

// LOGIN
export const login = (data) => api.post("/auth/login", data);

// SEND OTP (forgot password)
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

// VERIFY OTP
export const verifyOtp = (data) => api.post("/auth/verify-otp", data);

// RESET PASSWORD
export const resetPassword = (data) => api.post("/auth/reset-password", data);

// GET PROFILE
export const getProfile = () => api.get("/profile/me");

// UPDATE PROFILE (name, bio, avatarUrl)
export const updateProfile = (data) => api.patch("/profile/me", data);
