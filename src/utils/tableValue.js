/** Display placeholder for empty table / detail values */
export function displayValue(value, fallback = "—") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}
