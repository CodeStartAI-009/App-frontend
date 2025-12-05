// services/goalService.js
import api from "./api";

export const getGoals = () => api.get("/goals");
export const getSingleGoal = (id) => api.get(`/goals/${id}`);
export const createGoal = (data) => api.post("/goals/create", data);
export const updateGoal = (id, data) => api.put(`/goals/update/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/delete/${id}`);

// Correct: add saving uses POST and sends { amount } in body
export const addGoalSaving = (id, amount) => api.post(`/goals/add-saving/${id}`, { amount });
