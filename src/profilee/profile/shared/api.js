// Single place that knows where your axios instance lives.
// Original file imported "../api/axiosInstance" from src/, i.e. <project-root>/api/axiosInstance.
// If your path differs, fix it here once and everything else follows.
import api from "../../../api/axiosInstance";

export const API = "/api";
export const API_ORIGIN = "https://amsol-api-production.up.railway.app";
export default api;
