// services/expenseService.js
import api from "./api";

/* =====================================================
   IN-MEMORY CACHES (SESSION ONLY)
   NOTE: Cleared on app restart or manual invalidation
===================================================== */
let cachedSummaryRes = null;
let cachedMonthlyRes = null;
let cachedRecentRes = null;
let cachedActivityRes = null;
let cachedProfileRes = null;

/* =====================================================
   INTERNAL: CLEAR ALL CACHES
===================================================== */
export const clearExpenseCache = () => {
  cachedSummaryRes = null;
  cachedMonthlyRes = null;
  cachedRecentRes = null;
  cachedActivityRes = null;
  cachedProfileRes = null;
};

/* =====================================================
   ADD TRANSACTIONS
   → ALWAYS INVALIDATE ALL RELATED CACHES
===================================================== */
export const addExpense = async (data) => {
  const res = await api.post("/expense/add", data);
  clearExpenseCache();
  return res;
};

export const addIncome = async (data) => {
  const res = await api.post("/income/add", data);
  clearExpenseCache();
  return res;
};

/* =====================================================
   SUMMARY ROUTES
===================================================== */
export const getSummary = async (force = false) => {
  if (!force && cachedSummaryRes) return cachedSummaryRes;

  const res = await api.get("/summary");
  cachedSummaryRes = res;
  return res;
};

export const getTrendBreakdown = async () => {
  // Trends should always be fresh
  return api.get("/summary/trends");
};

export const getMonthlySummary = async (force = false) => {
  if (!force && cachedMonthlyRes) return cachedMonthlyRes;

  const res = await api.get("/summary/monthly");
  cachedMonthlyRes = res;
  return res;
};

/* =====================================================
   RECENT / ACTIVITY
===================================================== */
export const getRecentActivity = async (force = false) => {
  if (!force && cachedRecentRes) return cachedRecentRes;

  const res = await api.get("/transactions/recent");
  cachedRecentRes = res;
  return res;
};

/**
 * Backward-compatible activity endpoint
 * Used by Transactions screen
 */
export const getActivity = async (force = false) => {
  if (!force && cachedActivityRes) return cachedActivityRes;

  const res = await api.get("/transactions/balance");
  cachedActivityRes = res;
  return res;
};

/* =====================================================
   TRANSACTION OPERATIONS
===================================================== */
export const deleteTransaction = async (id, type) => {
  const res = await api.delete(`/transactions/delete/${type}/${id}`);
  clearExpenseCache();
  return res;
};

export const getSingleTransaction = async (id) => {
  return api.get(`/transactions/single/${id}`);
};

export const updateTransaction = async (id, data) => {
  const res = await api.put(`/transactions/update/${id}`, data);
  clearExpenseCache();
  return res;
};

/* =====================================================
   USER PROFILE (AFFECTS BALANCE)
===================================================== */
export const fetchUserProfile = async (force = false) => {
  if (!force && cachedProfileRes) return cachedProfileRes;

  const res = await api.get("/user/profile");
  cachedProfileRes = res;
  return res;
};

export const updateUserProfile = async (data) => {
  const res = await api.put("/user/update", data);
  clearExpenseCache();
  return res;
};

export const updateFinance = async (data) => {
  const res = await api.put("/user/update-finance", data);
  clearExpenseCache();
  return res;
};

export const secureUpdate = async (data) => {
  const res = await api.put("/user/secure-update", data);
  clearExpenseCache();
  return res;
};

export const changeEmail = (data) =>
  api.put("/user/change-email", data);

export const changePhone = (data) =>
  api.put("/user/change-phone", data);

export const changePassword = (data) =>
  api.put("/user/change-password", data);
