import api from "./axios";

// Auth API calls
const authAPI = {
  register: (username, password) =>
    api.post("/auth/register", { username, password }),

  login: (username, password) =>
    api.post("/auth/login", { username, password }),

  resetPassword: (username, newPassword) =>
    api.post("/auth/reset-password", { username, newPassword }),

  logout: () => api.post("/auth/logout"),

  refresh: () => api.post("/auth/refresh"),

  getMe: () => api.get("/auth/me"),
};

// Todos API calls
const todosAPI = {
  getAll: () => api.get("/todos"),

  create: (todo, completed = false) =>
    api.post("/todos", { todo, completed }),

  update: (id, todo) => api.put(`/todos/${id}`, { todo }),

  toggle: (id, completed) => api.put(`/todos/${id}/toggle`, { completed }),

  delete: (id) => api.delete(`/todos/${id}`),
};

export { authAPI, todosAPI };
