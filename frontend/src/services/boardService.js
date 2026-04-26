import api from "./api";

export const boardService = {
  getAll: async () => {
    const { data } = await api.get("/boards/");
    return data;
  },
  getOne: async (id) => {
    const { data } = await api.get(`/boards/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/boards/", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/boards/${id}`, payload);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/boards/${id}`);
    return data;
  },
  getLists: async (boardId) => {
    const { data } = await api.get(`/lists/board/${boardId}`);
    return data;
  },
  createList: async (payload) => {
    const { data } = await api.post("/lists/", payload);
    return data;
  },
  deleteList: async (id) => {
    const { data } = await api.delete(`/lists/${id}`);
    return data;
  },
};
