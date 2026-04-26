import api from "./api";

export const aiService = {
  suggest: async (title, context = "") => {
    const { data } = await api.post("/ai/suggest", { title, context });
    return data;
  },
  generate: async (title, priority = "medium") => {
    const { data } = await api.post("/ai/generate", { title, priority });
    return data;
  },
};
