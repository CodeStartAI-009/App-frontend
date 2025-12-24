// utils/analytics.js
import api from "../services/api";

/**
 * Track analytics events
 * @param {string} event - event name
 * @param {object} properties - optional metadata
 */
export const trackEvent = async (event, properties = {}) => {
  try {
    if (!event) return;

    // Fire and forget (do NOT await in UI-critical paths)
    api.post("/analytics/event", {
      event,
      properties,
      timestamp: Date.now(),
    });
  } catch (err) {
    // ❗ analytics must NEVER break the app
    // silent fail
  }
};
