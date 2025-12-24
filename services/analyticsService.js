// services/analyticsService.js
import api from "./api";

export const getUsageStats = async () => {
  const res = await api.get("/admin/analytics/usage");
  return res.data;
};

export const getEventStats = async () => {
  const res = await api.get("/admin/analytics/events");
  return res.data;
};
