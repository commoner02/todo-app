import api from "./axios";

// Auth API calls
const authAPI = {
  register: (username, password) =>
    api.post("/api/auth/register", { username, password }),

  login: (username, password) =>
    api.post("/api/auth/login", { username, password }),

  resetPassword: (username, newPassword) =>
    api.post("/api/auth/reset-password", { username, newPassword }),

  logout: () => api.post("/api/auth/logout"),

  refresh: () => api.post("/api/auth/refresh"),

  getMe: () => api.get("/api/auth/me"),
};

// Todos API calls
const todosAPI = {
  getAll: () => api.get("/api/todos"),

  create: (todo, completed = false) =>
    api.post("/api/todos", { todo, completed }),

  update: (id, todo) => api.put(`/api/todos/${id}`, { todo }),

  toggle: (id, completed) => api.put(`/api/todos/${id}/toggle`, { completed }),

  delete: (id) => api.delete(`/api/todos/${id}`),
};

export { authAPI, todosAPI };
