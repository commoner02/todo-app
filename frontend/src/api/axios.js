import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    //console.log(originalRequest);

    if (
      error.response?.status === 401 &&
      error.response?.data?.shouldRefresh &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/api/auth/refresh");
        return api(originalRequest);
      } catch (error) {
        console.log("Token Refresh Failed:", error.message);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
