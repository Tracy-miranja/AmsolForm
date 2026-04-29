import axios from "axios";

const api = axios.create({
  baseURL: "https://amsol-api-production.up.railway.app",
  withCredentials: true, // sends httpOnly cookies automatically
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  // Read token from localStorage (not httpOnly cookie)
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const code = error.response?.data?.code;
    const status = error.response?.status;

    // Don't retry refresh endpoint itself
    if (
  original.url?.includes("/api/auth/refresh") ||
  original.url?.includes("/api/auth/logout")  // ← THIS is the fix
) {
  return Promise.reject(error);
}

    if (status === 401 && code === "TOKEN_EXPIRED" && !original._retry) {
      if (isRefreshing) {
        // Queue up requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/api/auth/refresh");
        // If backend returns new access token in body, store it
        if (data.token) {
          localStorage.setItem("accessToken", data.token);
        }
        processQueue(null);
        return api(original); 
      } catch (refreshError) {
  processQueue(refreshError);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api/auth;";
  window.location.href = "/auth";
  return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    // Any other 401 (invalid token, no token) → redirect to login
    if (status === 401 && !original._retry) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api/auth;";
  window.location.href = "/auth";
}

    return Promise.reject(error);
  }
);

export default api;