// services/expenseService.js
import api from "./api";   // Your configured axios instance

/***********************
 *  ADD TRANSACTIONS
 ************************/
export const addExpense = (data) => api.post("/expense/add", data);
export const addIncome = (data) => api.post("/income/add", data);

/***********************
 *  SUMMARY ROUTES
 ************************/

export const getSummary = () => api.get("/summary");
export const getTrendBreakdown = () => api.get("/summary/trends");
export const getMonthlySummary = () => api.get("/summary/monthly");

/***********************
 *  ACTIVITY / RECENT
 ************************/

export const getRecentActivity = () => api.get("/transactions/recent");
export const getActivity = () => api.get("/transactions/balance");

/***********************
 *  DELETE + SINGLE
 ************************/

export const deleteTransaction = (id, type) =>
  api.delete(`/transactions/delete/${type}/${id}`);

export const getSingleTransaction = (id) =>
  api.get(`/transactions/single/${id}`);
// UPDATE transaction (expense or income)
export const updateTransaction = (id, data) =>
  api.put(`/transactions/update/${id}`, data);

/***********************
 *  USER PROFILE
 ************************/

// Fetch profile (name, username, email, phone, hasUPI, hasBank, balance, monthlyIncome)
export const fetchUserProfile = () => api.get("/user/profile");

// Update NON-sensitive profile fields (name, username, phone, upi, bankNumber)
export const updateUserProfile = (data) => api.put("/user/update", data);

/***********************
 *  USER FINANCE (NO PASSWORD)
 ************************/

// Update bankBalance or monthlyIncome — does NOT need password
export const updateFinance = (data) => api.put("/user/update-finance", data);

/***********************
 *  SENSITIVE UPDATES (PASSWORD REQUIRED)
 ************************/

// Update email, phone, UPI, bank account — NEEDS password
export const secureUpdate = (data) => api.put("/user/secure-update", data);
export const changeEmail = (data) => api.put("/user/change-email", data);
export const changePhone = (data) => api.put("/user/change-phone", data);
// Change password — NEEDS current password
export const changePassword = (data) => api.put("/user/change-password", data);
