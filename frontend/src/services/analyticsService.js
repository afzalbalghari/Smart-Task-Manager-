import api from "./api";

export const analyticsService = {
  getSummary: async () => {
    const { data } = await api.get("/analytics/summary");
    return data;
  },
  getNotifications: async () => {
    const { data } = await api.get("/analytics/notifications");
    return data;
  },
};
