// services/expenseService.js
import api from "./api";   // <-- Your configured axios instance

/***********************
 *  ADD TRANSACTIONS
 ************************/
export const addExpense = (data) => api.post("/expense/add", data);
export const addIncome  = (data) => api.post("/income/add", data);

/***********************
 *  SUMMARY ROUTES
 ************************/

// 🔹 THIS MONTH SUMMARY
export const getSummary = () => api.get("/summary");

// 🔹 TRENDS SUMMARY 
export const getTrendBreakdown = () => api.get("/summary/trends");

// 🔹 ALL MONTHS SUMMARY
export const getMonthlySummary = () => api.get("/summary/monthly");

/***********************
 *  ACTIVITY / RECENT
 ************************/

// 🔹 RECENT 10 TRANSACTIONS
export const getRecentActivity = () => api.get("/transactions/recent");

// 🔹 ALL TRANSACTIONS FOR MONTHLY BREAKDOWN GRAPH
export const getActivity = () => api.get("/transactions/balance");

/***********************
 *  DELETE + SINGLE
 ************************/

export const deleteTransaction = (id, type) =>
  api.delete(`/transactions/delete/${type}/${id}`);

export const getSingleTransaction = (id) =>
  api.get(`/transactions/single/${id}`);

/***********************
 *  USER PROFILE (NEW)
 ************************/

// 🔹 Fetch User Profile
export const fetchUserProfile = () => api.get("/user/profile");
export const updateUserProfile = (data) => api.put("/user/update", data);

