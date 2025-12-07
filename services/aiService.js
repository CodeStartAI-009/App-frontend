import api from "./api";

export const getCoins = () => api.get("/ai/coins");

export const sendChat = (data) => api.post("/ai/chat", data);

export const watchAd = () => api.post("/ai/watch-ad");

export const claimWeekly = () => api.post("/ai/claim-weekly");
