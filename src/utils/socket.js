import { io } from "socket.io-client";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

function resolveSocketUrl() {
  const url = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || "";
  if (!url) return null;

  const isSocketLocal = LOCAL_HOSTS.has(new URL(url).hostname);
  const pageHost = typeof window !== "undefined" ? window.location.hostname : "";
  const isPageLocal = LOCAL_HOSTS.has(pageHost);

  // Never call localhost from a production domain — triggers Android permission prompts.
  if (!isPageLocal && isSocketLocal) return null;

  return url;
}

let socketInstance = null;

export function getSocket() {
  const url = resolveSocketUrl();
  if (!url) return null;

  if (!socketInstance) {
    socketInstance = io(url, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
  }
}
