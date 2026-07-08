import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/adminSlice";

const adminAxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL || "https://api.techpath.in"}/admin`,
  withCredentials: true,
});

let isLoggingOut = false;

const forceAdminLogout = async (message) => {
  if (isLoggingOut) return;
  if (window.location.pathname.includes("/admin-login")) return;

  isLoggingOut = true;
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL || "https://api.techpath.in"}/admin/logout`,
      {},
      { withCredentials: true }
    );
  } catch (_) {
    /* ignore — cookies may already be cleared */
  }

  store.dispatch(logout());
  if (message) {
    try {
      const { toast } = await import("sonner");
      toast.warning(message);
    } catch (_) {
      /* toast optional */
    }
  }
  window.location.href = "/admin/admin-login";
};

adminAxiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message = data?.message || "";

    const shouldLogout =
      status === 401 &&
      (data?.logout === true ||
        data?.code === "AUTH_LOGOUT" ||
        /refresh token/i.test(message) ||
        /please login again/i.test(message) ||
        /access denied/i.test(message));

    if (shouldLogout) {
      await forceAdminLogout(
        message || "Session expired. Please login again."
      );
    }

    return Promise.reject(error);
  }
);

export default adminAxiosInstance;
