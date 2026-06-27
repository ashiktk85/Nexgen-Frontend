import axios from "axios";
import { resolveApiBaseUrl } from "@/utils/apiUrl";

const API_URL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    const { data } = await api.post("/api/auth/login", { email, password });
    return data;
  },
  async register(name, email, password) {
    const { data } = await api.post("/api/auth/register", { name, email, password });
    return data;
  },
  async me() {
    const { data } = await api.get("/api/auth/me");
    return data;
  },
  async setPassword(password, confirmPassword) {
    const { data } = await api.post("/api/auth/set-password", {
      password,
      confirmPassword,
    });
    return data;
  },
  async changePassword(currentPassword, newPassword) {
    const { data } = await api.post("/api/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  },
  loginWithGoogleRedirect() {
    window.location.href = `${API_URL}/api/auth/google`;
  },
};

