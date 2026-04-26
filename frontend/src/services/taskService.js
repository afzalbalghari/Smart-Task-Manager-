import api from "./api";

export const taskService = {
  create: async (payload) => {
    const { data } = await api.post("/tasks/", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data;
  },
  move: async (id, targetListId, position) => {
    const { data } = await api.put(`/tasks/${id}/move`, { target_list_id: targetListId, position });
    return data;
  },
  toggle: async (id) => {
    const { data } = await api.put(`/tasks/${id}/toggle`);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },
};
