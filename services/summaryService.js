import api from "./api";

export const getMonthlySummary = () => api.get("/summary/monthly");
