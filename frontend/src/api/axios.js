import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/login") &&
      !originalRequest.url?.includes("/users/register")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "/api/v1"}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.data?.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
