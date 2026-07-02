const GENERIC_AXIOS_MESSAGE = /^Request failed with status code \d+$/;

/**
 * Extract a user-facing message from an API/axios/redux error.
 */
export function getApiErrorMessage(error, fallback = "Something went wrong") {
  if (!error) return fallback;

  if (typeof error === "string" && error.trim()) return error.trim();

  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) return data.trim();
  if (typeof data?.message === "string" && data.message.trim()) return data.message.trim();
  if (typeof data?.error === "string" && data.error.trim()) return data.error.trim();

  if (typeof error.message === "string" && error.message.trim()) {
    if (!GENERIC_AXIOS_MESSAGE.test(error.message.trim())) {
      return error.message.trim();
    }
  }

  return fallback;
}
