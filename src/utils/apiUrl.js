const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

export function resolveApiBaseUrl(fallback = "https://api.techpath.in") {
  const configured = import.meta.env.VITE_BACKEND_URL || fallback;

  if (typeof window === "undefined") return configured;

  const pageHost = window.location.hostname;
  if (LOCAL_HOSTS.has(pageHost)) return configured;

  try {
    const apiHost = new URL(configured).hostname;
    if (LOCAL_HOSTS.has(apiHost)) return fallback;
  } catch {
    return fallback;
  }

  return configured;
}
