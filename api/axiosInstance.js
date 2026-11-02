import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:5001" : "https://amsol-api-production.up.railway.app",
  withCredentials: true,
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

// Auth endpoints whose JSON response carries a fresh access token
const TOKEN_ENDPOINTS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/google/complete",
];

const clearSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("amsol_session"); // saved employer/role session
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api/auth;";
};

// Records WHICH request caused the bounce (survives the page reload), then redirects
const goToAuth = (original, error) => {
  try {
    sessionStorage.setItem(
      "lastAuthFailure",
      JSON.stringify({
        url: original?.url || null,
        method: original?.method || null,
        status: error?.response?.status || null,
        code: error?.response?.data?.code || null,
        message: error?.response?.data?.message || null,
        at: new Date().toISOString(),
      })
    );
  } catch {}
  clearSession();
  if (window.location.pathname !== "/auth") {
    window.location.href = "/auth";
  }
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
  (response) => {
    // Keep localStorage.accessToken in sync with whatever the auth endpoints return
    const url = response.config?.url || "";
    const token = response.data?.token;
    if (token && TOKEN_ENDPOINTS.some((p) => url.includes(p))) {
      localStorage.setItem("accessToken", token);
    }
    return response;
  },
  async (error) => {
    const original = error.config;

    const code = error.response?.data?.code;
    const status = error.response?.status;

    // Don't retry or redirect on the refresh / logout endpoints themselves
    if (
      original.url?.includes("/api/auth/refresh") ||
      original.url?.includes("/api/auth/logout")
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
        if (data.token) {
          localStorage.setItem("accessToken", data.token);
        }
        processQueue(null);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError);
        goToAuth(original, refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Any other 401 (invalid token, no token) → back to login
    if (status === 401 && !original._retry) {
      goToAuth(original, error);
    }

    return Promise.reject(error);
  }
);

export default api;